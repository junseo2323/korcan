import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const friends = await prisma.friend.findMany({
            where: { userId: session.user.id },
            include: {
                friend: {
                    select: { id: true, name: true, image: true, email: true }
                }
            }
        })
        return NextResponse.json(friends.map(f => f.friend))
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { email } = await req.json()
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

        if (email === session.user.email) {
            return NextResponse.json({ error: 'Cannot add yourself' }, { status: 400 })
        }

        const friendUser = await prisma.user.findUnique({
            where: { email }
        })

        if (!friendUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const existing = await prisma.friend.findUnique({
            where: {
                userId_friendId: {
                    userId: session.user.id,
                    friendId: friendUser.id
                }
            }
        })

        if (existing) {
            return NextResponse.json({ error: 'Already friends' }, { status: 400 })
        }

        // Add friend (bidirectional for simplicity in this MVP, though schema allows uni)
        // Actually schema is uni-directional. Let's make it uni-directional for "Follow" style or bi-directional?
        // User requested "Friend Add". Usually implies bi-directional or request/accept.
        // For MVP simplicity, let's just create the link for the requester.
        // AND create the reverse link so it appears for both?
        // Let's do uni-directional "Add" for now, which effectively acts like a contact list.

        await prisma.friend.create({
            data: {
                userId: session.user.id,
                friendId: friendUser.id
            }
        })

        // Optional: Auto-add reverse link for "Friend" concept
        try {
            await prisma.friend.create({
                data: {
                    userId: friendUser.id,
                    friendId: session.user.id
                }
            })
        } catch (e) {
            // Ignore if already exists
        }

        return NextResponse.json({ success: true, friend: { id: friendUser.id, name: friendUser.name, image: friendUser.image } })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Failed to add friend' }, { status: 500 })
    }
}
