import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION || 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await req.formData()
        const files = formData.getAll('file') as File[]

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files received.' }, { status: 400 })
        }

        const bucketName = process.env.AWS_S3_BUCKET_NAME
        if (!bucketName || bucketName === 'korcan-uploads-placeholder') {
            // Fallback for local dev if bucket not configured? 
            // Or error out. Better error out to force config.
            // Actually, for better DX, if bucket is not set, maybe fallback to local?
            // But user asked for AWS connection. 
            // I'll return specific error.
            return NextResponse.json({ error: 'AWS S3 Bucket not configured.' }, { status: 500 })
        }

        const uploadedUrls: string[] = []

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer())
            const fileExtension = file.name.split('.').pop()
            const fileName = `uploads/${uuidv4()}.${fileExtension}`

            await s3Client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: buffer,
                ContentType: file.type,
                // ACL: 'public-read', // Bucket policy handles public access
            }))

            // Construct public URL
            // Assuming standard S3 URL format or CloudFront if configured. 
            // For now standard S3.
            const url = `https://${bucketName}.s3.${process.env.AWS_DEFAULT_REGION || 'ap-northeast-2'}.amazonaws.com/${fileName}`
            uploadedUrls.push(url)
        }

        // Return single URL if single file, list if multiple?
        // Existing implementation returned { url }. 
        // If I change response format, I might break Marketplace if it uses this.
        // Marketplace uses `formData.append('file', file)`.
        // If I upload multiple, client expects maybe list. 
        // But to keep backward compatibility with existing single file upload calls:
        if (files.length === 1) {
            return NextResponse.json({ url: uploadedUrls[0], urls: uploadedUrls })
        }

        return NextResponse.json({ urls: uploadedUrls })

    } catch (e: any) {
        console.error('Upload error:', e)
        return NextResponse.json({
            error: 'Upload failed',
            details: e.message,
            stack: e.stack
        }, { status: 500 })
    }
}
