import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const rule = await prisma.recurringRule.findUnique({
        where: { id }
    })

    if (!rule) {
        return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    if (rule.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.recurringRule.delete({
        where: { id }
    })

    return NextResponse.json({ success: true })
}
