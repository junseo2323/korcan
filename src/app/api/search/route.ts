import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()

  if (!q || q.length < 1) {
    return NextResponse.json({ posts: [], products: [], properties: [] })
  }

  const [posts, products, properties] = await Promise.all([
    prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true,
        user: { select: { name: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),

    prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        imageUrl: true,
        status: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),

    prisma.property.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { address: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        type: true,
        address: true,
        images: { select: { url: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  return NextResponse.json({ posts, products, properties })
}
