import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: propertyId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ liked: false })
    }

    const existing = await prisma.like.findUnique({
        where: { userId_propertyId: { userId: session.user.id, propertyId } }
    })

    return NextResponse.json({ liked: !!existing })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: propertyId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const existing = await prisma.like.findUnique({
        where: { userId_propertyId: { userId, propertyId } }
    })

    if (existing) {
        await prisma.like.delete({ where: { id: existing.id } })
        return NextResponse.json({ liked: false })
    } else {
        await prisma.like.create({ data: { userId, propertyId } })
        return NextResponse.json({ liked: true })
    }
}
