import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/products
// Optional query: ?category=Value
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const where = category && category !== 'All' ? { category } : {}

    try {
        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                seller: {
                    select: { name: true, image: true }
                },
                _count: {
                    select: { likes: true }
                },
                // We might want to include current user's like status if possible, 
                // but simpler to do it in a separate call or handle it on client for now or use specific query.
                // For list view, just counts are enough.
            }
        })
        return NextResponse.json(products)
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}

// POST /api/products
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { title, price, description, category, imageUrl } = body

        if (!title || !price || !description || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const product = await prisma.product.create({
            data: {
                title,
                price: Number(price),
                description,
                category,
                imageUrl,
                sellerId: session.user.id
            }
        })

        return NextResponse.json(product)
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
}
