import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const expense = await prisma.expense.findUnique({
        where: { id }
    })

    if (!expense) {
        return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    if (expense.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.expense.delete({
        where: { id }
    })

    return NextResponse.json({ success: true })
}
