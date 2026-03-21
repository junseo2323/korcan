import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { id } = await params
    const body = await req.json()
    const banner = await prisma.banner.update({ where: { id }, data: body })
    return NextResponse.json(banner)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { id } = await params
    await prisma.banner.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
