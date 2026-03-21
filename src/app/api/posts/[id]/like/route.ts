import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendPushToUser } from '@/lib/sendPushNotification'

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

        // Notify post author
        const post = await prisma.post.findUnique({ where: { id }, select: { userId: true, title: true } })
        if (post && post.userId !== session.user.id) {
            const message = `${session.user.name || '누군가'}님이 "${post.title.slice(0, 20)}"을 좋아합니다.`
            await prisma.notification.create({
                data: {
                    userId: post.userId,
                    type: 'LIKE',
                    message,
                    targetUrl: `/community/${id}`,
                },
            })
            sendPushToUser(post.userId, { title: 'KorCan 알림', body: message, url: `https://korcan.cc/community/${id}` }).catch(console.error)
        }

        return NextResponse.json({ liked: true })
    }
}
