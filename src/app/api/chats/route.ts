import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// List my chats
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const chats = await prisma.chatRoom.findMany({
            where: {
                users: {
                    some: { id: session.user.id }
                }
            },
            include: {
                users: {
                    select: { id: true, name: true, image: true, email: true }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { lastMessageAt: 'desc' }
        })
        return NextResponse.json(chats)
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
    }
}

// Create or Get Chat Room with a specific user
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { targetUserId } = await req.json()
        if (!targetUserId) return NextResponse.json({ error: 'Target user required' }, { status: 400 })

        // Check if a room with EXACTLY these two users already exists
        // This is tricky in Prisma. We can find rooms where loggedInUser is present, then filter in code or detailed query.
        // For strict 1:1, we can query rooms with these 2 users.

        const existingRooms = await prisma.chatRoom.findMany({
            where: {
                AND: [
                    { users: { some: { id: session.user.id } } },
                    { users: { some: { id: targetUserId } } }
                ]
            },
            include: { users: true }
        })

        // Filter for rooms with exactly 2 users
        const exactRoom = existingRooms.find(r => r.users.length === 2)

        if (exactRoom) {
            return NextResponse.json(exactRoom)
        }

        // Create new room
        const newRoom = await prisma.chatRoom.create({
            data: {
                users: {
                    connect: [
                        { id: session.user.id },
                        { id: targetUserId }
                    ]
                }
            }
        })

        return NextResponse.json(newRoom)

    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 })
    }
}
