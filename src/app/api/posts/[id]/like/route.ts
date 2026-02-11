import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params // postId

    // Check if already liked
    const existingIcon = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId: session.user.id,
                postId: id
            }
        }
    })

    if (existingIcon) {
        // Unlike
        await prisma.like.delete({
            where: { id: existingIcon.id }
        })
        return NextResponse.json({ liked: false })
    } else {
        // Like
        await prisma.like.create({
            data: {
                userId: session.user.id,
                postId: id
            }
        })
        return NextResponse.json({ liked: true })
    }
}
