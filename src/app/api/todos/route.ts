import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = { userId: session.user.id }

    if (date) {
        const start = new Date(`${date}T00:00:00`)
        const end = new Date(`${date}T23:59:59`)
        where.date = { gte: start, lte: end }
    } else if (startDate && endDate) {
        where.date = {
            gte: new Date(`${startDate}T00:00:00`),
            lte: new Date(`${endDate}T23:59:59`)
        }
    }

    const todos = await prisma.todo.findMany({
        where,
        orderBy: { date: 'asc' }
    })

    return NextResponse.json(todos)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { text, date, tagColor } = body

    const todo = await prisma.todo.create({
        data: {
            text,
            date: new Date(date),
            tagColor,
            userId: session.user.id
        }
    })

    return NextResponse.json(todo)
}
