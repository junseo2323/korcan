import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { status, like } = body // 'like' is a flag? Or should we have separate endpoint?

    // Handling Likes vs Status update in one endpoint is messy but doable for simple apps.
    // Better to have separate endpoint for likes.
    // Let's handle 'status' here.

    const product = await prisma.product.findUnique({
        where: { id },
        include: { seller: true }
    })

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    if (status) {
        // Only seller can update status
        if (product.seller.email !== session.user.email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const updated = await prisma.product.update({
            where: { id },
            data: { status }
        })
        return NextResponse.json(updated)
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })
}
