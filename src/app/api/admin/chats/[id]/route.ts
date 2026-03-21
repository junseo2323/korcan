import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { id } = await params

    const [room, messages] = await Promise.all([
        prisma.chatRoom.findUnique({
            where: { id },
            include: { users: { select: { id: true, name: true, image: true } } },
        }),
        prisma.message.findMany({
            where: { chatRoomId: id },
            include: { sender: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: 'asc' },
        }),
    ])

    if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ room, messages })
}
