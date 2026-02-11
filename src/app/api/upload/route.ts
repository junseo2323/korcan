import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = Date.now() + '-' + file.name.replace(/\s/g, '-')
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')

        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // Ignore if exists
        }

        await writeFile(path.join(uploadDir, filename), buffer)

        return NextResponse.json({ url: `/uploads/${filename}` })
    } catch (e) {
        console.error('Upload error:', e)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
