import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Parser from 'rss-parser'

export const dynamic = 'force-dynamic'

const parser = new Parser()

// Job Bank Canada province codes
const PROVINCES = [
  { fprov: 'BC', region: 'bc' },
  { fprov: 'ON', region: 'on' },
  { fprov: 'AB', region: 'ab' },
  { fprov: 'QC', region: 'qc' },
]

async function fetchJobBank(fprov: string): Promise<any[]> {
  try {
    const url = `https://www.jobbank.gc.ca/jobsearch/feed/jobSearchRSSfeed?fage=3&sort=D&rows=100&fprov=${fprov}`
    const feed = await parser.parseURL(url)
    return feed.items || []
  } catch {
    return []
  }
}

// summary format: "<strong>Job number:</strong> 123<br /><strong>Location:</strong> Vancouver (BC)<br /><strong>Employer:</strong> ACME<br /><strong>Salary:</strong> $30 hourly"
function parseSummary(html: string) {
  const location = html.match(/<strong>Location:<\/strong>\s*([^<]+)/)?.[1]?.trim() || null
  const company  = html.match(/<strong>Employer:<\/strong>\s*([^<]+)/)?.[1]?.trim() || null
  const salary   = html.match(/<strong>Salary:<\/strong>\s*([^<]+)/)?.[1]?.trim() || null
  return { location, company, salary }
}

function parseJobBankItem(item: any, region: string) {
  const summary = item.summary || item.content || ''
  const { location, company, salary } = parseSummary(summary)
  const url = item.link || ''
  const externalId = `jobbank_${url.split('/').pop() || item.id || url}`

  return {
    externalId,
    source: 'jobbank',
    title: item.title || '',
    company,
    location,
    region,
    description: null,
    url,
    salary,
    jobType: null,
    category: null,
    postedAt: item.pubDate ? new Date(item.pubDate) : item.isoDate ? new Date(item.isoDate) : null,
    active: true,
    fetchedAt: new Date(),
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let upserted = 0
  let errors = 0

  for (const { fprov, region } of PROVINCES) {
    const items = await fetchJobBank(fprov)
    for (const item of items) {
      const job = parseJobBankItem(item, region)
      if (!job.url) continue
      try {
        await prisma.job.upsert({
          where: { externalId: job.externalId },
          update: { fetchedAt: job.fetchedAt, active: true },
          create: job,
        })
        upserted++
      } catch {
        errors++
      }
    }
  }

  // 30일 지난 항목 비활성화
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)
  await prisma.job.updateMany({
    where: { fetchedAt: { lt: cutoff } },
    data: { active: false },
  })

  return NextResponse.json({ upserted, errors })
}
