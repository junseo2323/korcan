import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const where = category && category !== 'All' ? { category } : {}

    const posts = await prisma.post.findMany({
        where,
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
            category: category || '일반',
            userId: session.user.id
        }
    })

    return NextResponse.json(post)
}
