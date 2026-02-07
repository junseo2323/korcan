import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
    // Publicly accessible, but maybe we want to know if user liked it?
    // For now, just return list. Order by createdAt desc.
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, image: true }
            },
            _count: {
                select: { comments: true, likes: true }
            }
        }
    })

    return NextResponse.json(posts)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, category } = body

    if (!title || !content) {
        return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const post = await prisma.post.create({
        data: {
            title,
            content,
            userId: session.user.id
        }
    })

    return NextResponse.json(post)
}
