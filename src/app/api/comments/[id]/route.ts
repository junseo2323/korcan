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

    const comment = await prisma.comment.findUnique({
        where: { id }
    })

    if (!comment) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Allow deletion if user is author of comment OR author of the post?
    // For now, strict: only comment author.
    if (comment.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.comment.delete({
        where: { id }
    })

    return NextResponse.json({ success: true })
}
