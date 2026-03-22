import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Parser from 'rss-parser'

export const dynamic = 'force-dynamic'

const parser = new Parser({
  customFields: {
    item: [['georss:point', 'georss'], ['salary', 'salary']],
  },
})

const REGIONS = [
  { label: 'Vancouver', query: 'Vancouver%2C+BC', region: 'bc' },
  { label: 'Toronto', query: 'Toronto%2C+ON', region: 'on' },
  { label: 'Calgary', query: 'Calgary%2C+AB', region: 'ab' },
  { label: 'Edmonton', query: 'Edmonton%2C+AB', region: 'ab' },
  { label: 'Montreal', query: 'Montreal%2C+QC', region: 'qc' },
  { label: 'Ottawa', query: 'Ottawa%2C+ON', region: 'on' },
]

async function fetchJobBank(regionQuery: string): Promise<any[]> {
  try {
    const url = `https://www.jobbank.gc.ca/jobsearch/feeds/rss.xml?search_term=&locationSrc=&location=${regionQuery}&locationRadius=25&lang=en`
    const feed = await parser.parseURL(url)
    return feed.items || []
  } catch {
    return []
  }
}

async function fetchIndeed(regionQuery: string): Promise<any[]> {
  try {
    const url = `https://ca.indeed.com/rss?q=&l=${regionQuery}&sort=date&limit=25`
    const feed = await parser.parseURL(url)
    return feed.items || []
  } catch {
    return []
  }
}

function parseJobBankItem(item: any, region: string) {
  const title = item.title || ''
  // Job Bank title format: "Job Title - Company Name - Location"
  const parts = title.split(' - ')
  const jobTitle = parts[0]?.trim() || title
  const company = parts[1]?.trim() || null
  const location = parts[2]?.trim() || null

  return {
    externalId: `jobbank_${item.guid || item.link}`,
    source: 'jobbank',
    title: jobTitle,
    company,
    location,
    region,
    description: item.contentSnippet || item.content || null,
    url: item.link || '',
    salary: item.salary || null,
    jobType: null,
    category: item.category || null,
    postedAt: item.pubDate ? new Date(item.pubDate) : null,
    active: true,
    fetchedAt: new Date(),
  }
}

function parseIndeedItem(item: any, region: string) {
  return {
    externalId: `indeed_${item.guid || item.link}`,
    source: 'indeed',
    title: item.title || '',
    company: item['source'] || null,
    location: null,
    region,
    description: item.contentSnippet || item.content || null,
    url: item.link || '',
    salary: null,
    jobType: null,
    category: null,
    postedAt: item.pubDate ? new Date(item.pubDate) : null,
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

  for (const { query, region } of REGIONS) {
    const [jobBankItems, indeedItems] = await Promise.all([
      fetchJobBank(query),
      fetchIndeed(query),
    ])

    const allJobs = [
      ...jobBankItems.map(item => parseJobBankItem(item, region)),
      ...indeedItems.map(item => parseIndeedItem(item, region)),
    ]

    for (const job of allJobs) {
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
