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

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

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

    // Update
    const updated = await prisma.expense.update({
        where: { id },
        data: {
            amount: body.amount,
            currency: body.currency,
            category: body.category,
            date: new Date(body.date),
            note: body.note
        }
    })

    return NextResponse.json(updated)
}
