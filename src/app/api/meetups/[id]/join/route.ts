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

    const { id: meetupId } = await params

    try {
        const meetup = await prisma.meetup.findUnique({
            where: { id: meetupId },
            include: { participants: true, posts: { select: { id: true }, take: 1 } }
        })

        if (!meetup) {
            return NextResponse.json({ error: 'Meetup not found' }, { status: 404 })
        }

        const postId = meetup.posts[0]?.id
        const meetupUrl = postId ? `/community/${postId}` : `/community`

        if (meetup.status === 'CLOSED') {
            return NextResponse.json({ error: 'Meetup is closed' }, { status: 400 })
        }

        if (meetup.participants.length >= meetup.maxMembers) {
            return NextResponse.json({ error: 'Meetup is full' }, { status: 400 })
        }

        const isParticipant = meetup.participants.some(p => p.id === session.user.id)
        if (isParticipant) {
            return NextResponse.json({ error: 'Already joined' }, { status: 400 })
        }

        // Transaction: Add to Meetup & Add to ChatRoom
        await prisma.$transaction(async (tx) => {
            // 1. Add to Meetup
            await tx.meetup.update({
                where: { id: meetupId },
                data: {
                    participants: { connect: { id: session.user.id } },
                    currentMembers: { increment: 1 }
                }
            })

            // 2. Add to ChatRoom
            const chatRoom = await tx.chatRoom.findUnique({ where: { meetupId } })
            if (chatRoom) {
                await tx.chatRoom.update({
                    where: { id: chatRoom.id },
                    data: {
                        users: { connect: { id: session.user.id } }
                    }
                })
            }

            // 3. Notify organizer
            if (meetup.organizerId !== session.user.id) {
                await tx.notification.create({
                    data: {
                        userId: meetup.organizerId,
                        type: 'MEETUP_JOIN',
                        message: `${session.user.name || '누군가'}님이 "${meetup.title.slice(0, 20)}"에 참가했습니다.`,
                        targetUrl: meetupUrl,
                    },
                })
            }
        })

        // Push notification (fire-and-forget)
        if (meetup.organizerId !== session.user.id) {
            const message = `${session.user.name || '누군가'}님이 "${meetup.title.slice(0, 20)}"에 참가했습니다.`
            sendPushToUser(meetup.organizerId, { title: 'KorCan 알림', body: message, url: `https://korcan.cc${meetupUrl}` }).catch(console.error)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to join meetup' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: meetupId } = await params

    try {
        const meetup = await prisma.meetup.findUnique({
            where: { id: meetupId },
            include: { participants: true }
        })

        if (!meetup) {
            return NextResponse.json({ error: 'Meetup not found' }, { status: 404 })
        }

        const isParticipant = meetup.participants.some(p => p.id === session.user.id)
        if (!isParticipant) {
            return NextResponse.json({ error: 'Not a participant' }, { status: 400 })
        }

        if (meetup.organizerId === session.user.id) {
            return NextResponse.json({ error: 'Organizer cannot leave' }, { status: 400 })
        }

        // Transaction: Remove from Meetup & Remove from ChatRoom
        await prisma.$transaction(async (tx) => {
            // 1. Remove from Meetup
            await tx.meetup.update({
                where: { id: meetupId },
                data: {
                    participants: { disconnect: { id: session.user.id } },
                    currentMembers: { decrement: 1 }
                }
            })

            // 2. Remove from ChatRoom
            const chatRoom = await tx.chatRoom.findUnique({ where: { meetupId } })
            if (chatRoom) {
                await tx.chatRoom.update({
                    where: { id: chatRoom.id },
                    data: {
                        users: { disconnect: { id: session.user.id } }
                    }
                })
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to leave meetup' }, { status: 500 })
    }
}
