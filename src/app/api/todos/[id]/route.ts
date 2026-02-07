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
    const todo = await prisma.todo.findUnique({
        where: { id }
    })

    if (!todo) {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    if (todo.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.todo.delete({
        where: { id }
    })

    return NextResponse.json({ success: true })
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { isCompleted } = body

    // Verify ownership
    const todo = await prisma.todo.findUnique({
        where: { id }
    })

    if (!todo) {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    if (todo.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.todo.update({
        where: { id },
        data: { isCompleted }
    })

    return NextResponse.json(updated)
}
