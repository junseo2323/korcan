import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_LAYOUT } from '@/app/api/admin/home-layout/route'

export const dynamic = 'force-dynamic'

export async function GET() {
    const config = await prisma.siteConfig.findUnique({ where: { key: 'home_layout' } })
    return NextResponse.json(config?.value ?? DEFAULT_LAYOUT)
}
