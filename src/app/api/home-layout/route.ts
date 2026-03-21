import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_LAYOUT } from '@/app/api/admin/home-layout/route'

export const revalidate = 60 // cache 1 minute

export async function GET() {
    const config = await prisma.siteConfig.findUnique({ where: { key: 'home_layout' } })
    return NextResponse.json(config?.value ?? DEFAULT_LAYOUT)
}
