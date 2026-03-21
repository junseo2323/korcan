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
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
            ],
        }
        : {}

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                region: true,
                isRegistered: true,
                createdAt: true,
                _count: { select: { posts: true, products: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.user.count({ where }),
    ])

    return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) })
}

export async function DELETE(req: Request) {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { id } = await req.json()
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
