import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ ok: false })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Only write if lastActiveAt is not today
    await prisma.user.updateMany({
        where: {
            id: (session.user as any).id,
            OR: [
                { lastActiveAt: null },
                { lastActiveAt: { lt: today } },
            ],
        },
        data: { lastActiveAt: new Date() },
    })

    return NextResponse.json({ ok: true })
}
