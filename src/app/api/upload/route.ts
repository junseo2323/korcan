import { NextResponse, NextRequest } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
    region: process.env.KORCAN_AWS_DEFAULT_REGION || 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.KORCAN_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.KORCAN_AWS_SECRET_ACCESS_KEY || '',
    },
})

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const files = formData.getAll('file') as File[]

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files received.' }, { status: 400 })
        }

        const bucketName = process.env.KORCAN_AWS_S3_BUCKET_NAME
        if (!bucketName || bucketName === 'korcan-uploads-placeholder') {
            return NextResponse.json({ error: 'AWS S3 Bucket not configured.' }, { status: 500 })
        }

        const uploadedUrls: string[] = []

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer())
            // Sanitize filename or just use uuid
            // Keeping original extension
            const fileExtension = file.name.split('.').pop() || 'jpg'
            const fileName = `uploads/${uuidv4()}.${fileExtension}`

            await s3Client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: buffer,
                ContentType: file.type,
                // ACL is handled by bucket policy
            }))

            const url = `https://${bucketName}.s3.${process.env.KORCAN_AWS_DEFAULT_REGION || 'ap-northeast-2'}.amazonaws.com/${fileName}`
            uploadedUrls.push(url)
        }

        // Return first url as 'url' for backward compatibility, and full list as 'urls'
        return NextResponse.json({
            url: uploadedUrls[0],
            urls: uploadedUrls
        })

    } catch (e: any) {
        console.error('Upload error:', e)
        return NextResponse.json({
            error: 'Upload failed',
            details: e.message
        }, { status: 500 })
    }
}
