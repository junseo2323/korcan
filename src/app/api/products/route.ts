import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
    const products = await prisma.product.findMany({
        include: {
            seller: { select: { name: true, image: true } },
            _count: { select: { likes: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    const formattedProducts = products.map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description,
        category: p.category,
        imageUrl: p.imageUrl,
        seller: p.seller.name || 'Unknown',
        date: p.createdAt.toISOString().split('T')[0],
        status: p.status,
        likes: p._count.likes
    }))

    return NextResponse.json(formattedProducts)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, price, description, category, imageUrl } = body

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const product = await prisma.product.create({
        data: {
            title,
            price,
            description,
            category,
            imageUrl,
            sellerId: user.id
        }
    })

    return NextResponse.json(product)
}
