import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7) // 7일 이상 된 미완성 유저

  const result = await prisma.user.deleteMany({
    where: {
      isRegistered: false,
      createdAt: { lt: cutoff },
    },
  })

  return NextResponse.json({ deleted: result.count })
}
