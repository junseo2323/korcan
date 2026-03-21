import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: Request) {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20

    const [rooms, total] = await Promise.all([
        prisma.chatRoom.findMany({
            include: {
                users: { select: { id: true, name: true, image: true } },
                _count: { select: { messages: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { content: true, createdAt: true },
                },
            },
            orderBy: { lastMessageAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.chatRoom.count(),
    ])

    return NextResponse.json({ rooms, total, page, pages: Math.ceil(total / limit) })
}
