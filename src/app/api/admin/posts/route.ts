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
        ? { OR: [{ title: { contains: search, mode: 'insensitive' as const } }] }
        : {}

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                _count: { select: { likes: true, comments: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.post.count({ where }),
    ])

    return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) })
}

export async function DELETE(req: Request) {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { id } = await req.json()
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
