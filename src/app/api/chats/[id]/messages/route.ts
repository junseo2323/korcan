import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id: roomId } = await params

    try {
        // Verify user is in the room
        const room = await prisma.chatRoom.findUnique({
            where: { id: roomId },
            include: { users: { select: { id: true } } }
        })

        if (!room || !room.users.find(u => u.id === session.user.id)) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        const messages = await prisma.message.findMany({
            where: { chatRoomId: roomId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { id: true, name: true, image: true } }
            }
        })

        return NextResponse.json(messages)
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id: roomId } = await params

    try {
        const { content } = await req.json()
        if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

        // Verify user is in the room
        const room = await prisma.chatRoom.findUnique({
            where: { id: roomId },
            include: { users: { select: { id: true } } }
        })

        if (!room || !room.users.find(u => u.id === session.user.id)) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        const message = await prisma.message.create({
            data: {
                content,
                chatRoomId: roomId,
                senderId: session.user.id
            },
            include: {
                sender: { select: { id: true, name: true, image: true } }
            }
        })

        // Update room lastMessageAt
        await prisma.chatRoom.update({
            where: { id: roomId },
            data: { lastMessageAt: new Date() }
        })

        return NextResponse.json(message)
    } catch (e) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }
}
