import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/products/[id]
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                seller: {
                    select: { id: true, name: true, image: true, email: true }
                },
                _count: {
                    select: { likes: true }
                },
                likes: userId ? {
                    where: { userId },
                    select: { userId: true }
                } : false
            }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Add isLiked field
        const isLiked = userId ? product.likes.length > 0 : false
        const { likes, ...rest } = product

        return NextResponse.json({ ...rest, isLiked })

    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }
}

// PUT /api/products/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        if (product.sellerId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await req.json()
        // Only allow updating specific fields for now
        const { title, price, description, category, imageUrl, status } = body

        const updated = await prisma.product.update({
            where: { id },
            data: { title, price, description, category, imageUrl, status }
        })

        return NextResponse.json(updated)
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
}

// DELETE /api/products/[id]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        if (product.sellerId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await prisma.product.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}
