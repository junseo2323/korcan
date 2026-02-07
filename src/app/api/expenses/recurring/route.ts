import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rules = await prisma.recurringRule.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(rules)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { amount, currency, category, note, frequency, day } = body

    const rule = await prisma.recurringRule.create({
        data: {
            amount: Number(amount),
            currency,
            category,
            note,
            frequency,
            day: Number(day),
            userId: session.user.id
        }
    })

    return NextResponse.json(rule)
}
