import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET() {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(banners)
}

export async function POST(req: Request) {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const body = await req.json()
    const banner = await prisma.banner.create({ data: body })
    return NextResponse.json(banner)
}
