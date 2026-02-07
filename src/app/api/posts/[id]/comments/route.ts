import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    const comments = await prisma.comment.findMany({
        where: { postId: id },
        include: {
            user: {
                select: { id: true, name: true, image: true }
            }
        },
        orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(comments)
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    // Comments might be allowed for guests? Probably not for now.
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { content } = body

    if (!content) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
        data: {
            content,
            postId: id,
            userId: session.user.id
        },
        include: {
            user: { select: { id: true, name: true, image: true } }
        }
    })

    return NextResponse.json(comment)
}
