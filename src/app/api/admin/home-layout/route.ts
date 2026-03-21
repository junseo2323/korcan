import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export const DEFAULT_LAYOUT = [
    { key: 'supporters', label: '서포터즈 광고', size: 'full', visible: true },
    { key: 'timezone', label: '세계 시계', size: 'half', visible: true },
    { key: 'schedule', label: '오늘의 일정', size: 'quarter', visible: true },
    { key: 'expense', label: '이번달 지출', size: 'quarter', visible: true },
    { key: 'meetup', label: '모임 추천', size: 'half', visible: true },
    { key: 'popular_posts', label: '인기글', size: 'half', visible: true },
    { key: 'banner', label: '동적 배너', size: 'half', visible: true },
    { key: 'property', label: '부동산 추천', size: 'half', visible: true },
    { key: 'ad', label: '광고', size: 'full', visible: true },
]

export async function GET() {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const config = await prisma.siteConfig.findUnique({ where: { key: 'home_layout' } })
    return NextResponse.json(config?.value ?? DEFAULT_LAYOUT)
}

export async function PUT(req: Request) {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const layout = await req.json()
    await prisma.siteConfig.upsert({
        where: { key: 'home_layout' },
        update: { value: layout },
        create: { key: 'home_layout', value: layout },
    })
    return NextResponse.json({ ok: true })
}
