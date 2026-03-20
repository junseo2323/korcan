import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const likes = await prisma.like.findMany({
        where: {
            userId: session.user.id,
            propertyId: { not: null },
        },
        include: {
            property: {
                include: {
                    images: { take: 1 },
                    _count: { select: { likes: true } },
                }
            }
        },
        orderBy: { id: 'desc' },
    })

    const properties = likes
        .map((l) => l.property)
        .filter(Boolean)

    return NextResponse.json(properties)
}
