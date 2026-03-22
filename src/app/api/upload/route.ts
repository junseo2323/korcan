import { NextResponse, NextRequest } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'
import { apiError } from '@/lib/apiError'
import { checkRateLimit } from '@/lib/rateLimit'

const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif',
])

const AWS_REGION = process.env.KORCAN_AWS_DEFAULT_REGION || 'ca-central-1'

const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: process.env.KORCAN_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.KORCAN_AWS_SECRET_ACCESS_KEY || '',
    },
})

export async function POST(req: NextRequest) {
    const limited = checkRateLimit(req, 'upload', { limit: 10, windowMs: 60_000 })
    if (limited) return limited

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
            // MIME 타입 화이트리스트 검증
            if (!ALLOWED_MIME_TYPES.has(file.type)) {
                return NextResponse.json(
                    { error: '이미지 파일만 업로드할 수 있습니다. (jpg, png, gif, webp, heic)' },
                    { status: 400 }
                )
            }

            const buffer = Buffer.from(await file.arrayBuffer())
            const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
            const fileName = `uploads/${uuidv4()}.${fileExtension}`

            await s3Client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: buffer,
                ContentType: file.type,
            }))

            const url = `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${fileName}`
            uploadedUrls.push(url)
        }

        return NextResponse.json({
            url: uploadedUrls[0],
            urls: uploadedUrls
        })

    } catch (error: unknown) {
        return apiError('Upload failed', error)
    }
}
