import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const region = searchParams.get('region') || ''
  const keyword = searchParams.get('keyword') || ''
  const source = searchParams.get('source') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20

  const where: any = { active: true }

  if (region) where.region = region
  if (source) where.source = source
  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: 'insensitive' } },
      { company: { contains: keyword, mode: 'insensitive' } },
      { location: { contains: keyword, mode: 'insensitive' } },
    ]
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: [{ postedAt: 'desc' }, { fetchedAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ])

  return NextResponse.json({ jobs, total, page, totalPages: Math.ceil(total / limit) })
}
