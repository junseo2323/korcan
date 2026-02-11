import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const expenses = await prisma.expense.findMany({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' }
    })

    return NextResponse.json(expenses)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { amount, currency, category, date, note } = body

    const expense = await prisma.expense.create({
        data: {
            amount: Number(amount),
            currency,
            category,
            date: new Date(date),
            note,
            userId: session.user.id
        }
    })

    return NextResponse.json(expense)
}
