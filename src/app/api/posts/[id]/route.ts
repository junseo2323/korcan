import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Increment views
    // Optimistic update not needed here, just fire and forget or await
    await prisma.post.update({
        where: { id },
        data: { views: { increment: 1 } }
    })

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, name: true, image: true }
            },
            comments: {
                include: {
                    user: { select: { id: true, name: true, image: true } }
                },
                orderBy: { createdAt: 'asc' }
            },
            likes: true, // simplified, or we can check if user liked it
            _count: {
                select: { likes: true, comments: true }
            },
            meetup: {
                include: {
                    participants: {
                        select: { id: true, name: true, image: true }
                    },
                    chatRoom: {
                        select: { id: true }
                    },
                }
            },
            images: true
        }
    })

    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if current user liked this post
    const isLiked = session?.user?.id ? post.likes.some(like => like.userId === session.user.id) : false

    return NextResponse.json({ ...post, isLiked })
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const post = await prisma.post.findUnique({
        where: { id }
    })

    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.post.delete({
        where: { id }
    })

    return NextResponse.json({ success: true })
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { title, content, category } = body

    const post = await prisma.post.findUnique({
        where: { id }
    })

    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.post.update({
        where: { id },
        data: { title, content, category }
    })

    return NextResponse.json(updated)
}
