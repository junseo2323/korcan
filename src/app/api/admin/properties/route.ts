import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: Request) {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20

    const where = search
        ? { OR: [{ title: { contains: search, mode: 'insensitive' as const } }, { address: { contains: search, mode: 'insensitive' as const } }] }
        : {}

    const [properties, total] = await Promise.all([
        prisma.property.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                images: { take: 1 },
                _count: { select: { likes: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.property.count({ where }),
    ])

    return NextResponse.json({ properties, total, page, pages: Math.ceil(total / limit) })
}

export async function DELETE(req: Request) {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { id } = await req.json()
    await prisma.property.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
