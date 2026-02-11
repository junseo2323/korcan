import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const userId = session.user.id
        const productId = id

        // Check if already liked
        const existing = await prisma.like.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        })

        if (existing) {
            await prisma.like.delete({
                where: { id: existing.id }
            })
            return NextResponse.json({ liked: false })
        } else {
            await prisma.like.create({
                data: { userId, productId }
            })
            return NextResponse.json({ liked: true })
        }
    } catch (e) {
        return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
    }
}
