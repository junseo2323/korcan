import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Parser from 'rss-parser'

export const dynamic = 'force-dynamic'

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; KorCan/1.0; +https://korcan.cc)',
    'Accept': 'application/atom+xml, application/rss+xml, text/xml, */*',
  },
})

// ─── Job Bank Canada ───────────────────────────────────────────────────────────

const JB_PROVINCES = [
  { fprov: 'BC', region: 'bc' },
  { fprov: 'ON', region: 'on' },
  { fprov: 'AB', region: 'ab' },
  { fprov: 'QC', region: 'qc' },
  { fprov: 'MB', region: 'mb' },
  { fprov: 'NS', region: 'ns' },
]

async function fetchJobBank(fprov: string): Promise<{ items: any[], error?: string }> {
  try {
    const url = `https://www.jobbank.gc.ca/jobsearch/feed/jobSearchRSSfeed?fage=3&sort=D&rows=100&fprov=${fprov}`
    const feed = await parser.parseURL(url)
    return { items: feed.items || [] }
  } catch (e: any) {
    return { items: [], error: `jobbank-${fprov}: ${e?.message || e}` }
  }
}

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

// ─── Adzuna ────────────────────────────────────────────────────────────────────

const ADZUNA_CITIES = [
  { where: 'Vancouver', region: 'bc' },
  { where: 'Toronto', region: 'on' },
  { where: 'Calgary', region: 'ab' },
  { where: 'Edmonton', region: 'ab' },
  { where: 'Montreal', region: 'qc' },
  { where: 'Ottawa', region: 'on' },
  { where: 'Winnipeg', region: 'mb' },
  { where: 'Halifax', region: 'ns' },
]

async function fetchAdzuna(city: string, region: string): Promise<{ items: any[], error?: string }> {
  const appId  = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY
  if (!appId || !appKey) return { items: [], error: 'Adzuna credentials missing' }

  try {
    const url = `https://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&where=${encodeURIComponent(city)}&sort_by=date`
    const res = await fetch(url)
    if (!res.ok) return { items: [], error: `adzuna-${city}: HTTP ${res.status}` }
    const data = await res.json()
    return { items: (data.results || []).map((j: any) => ({ ...j, _region: region })) }
  } catch (e: any) {
    return { items: [], error: `adzuna-${city}: ${e?.message}` }
  }
}

function parseAdzunaItem(item: any) {
  return {
    externalId: `adzuna_${item.id}`,
    source: 'adzuna',
    title: item.title || '',
    company: item.company?.display_name || null,
    location: item.location?.display_name || null,
    region: item._region,
    description: item.description || null,
    url: item.redirect_url || '',
    salary: item.salary_min
      ? `$${Math.round(item.salary_min / 1000)}k${item.salary_max ? `–$${Math.round(item.salary_max / 1000)}k` : '+'}`
      : null,
    jobType: item.contract_time === 'full_time' ? 'FULL_TIME' : item.contract_time === 'part_time' ? 'PART_TIME' : null,
    category: item.category?.label || null,
    postedAt: item.created ? new Date(item.created) : null,
    active: true,
    fetchedAt: new Date(),
  }
}

// ─── RemoteOK ──────────────────────────────────────────────────────────────────

async function fetchRemoteOK(): Promise<{ items: any[], error?: string }> {
  try {
    const res = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KorCan/1.0; +https://korcan.cc)',
      },
    })
    if (!res.ok) return { items: [], error: `remoteok: HTTP ${res.status}` }
    const data = await res.json()
    // First element is metadata, rest are jobs
    return { items: Array.isArray(data) ? data.slice(1, 101) : [] }
  } catch (e: any) {
    return { items: [], error: `remoteok: ${e?.message}` }
  }
}

function parseRemoteOKItem(item: any) {
  const salary = item.salary_min
    ? `$${Math.round(item.salary_min / 1000)}k–$${Math.round(item.salary_max / 1000)}k`
    : null
  return {
    externalId: `remoteok_${item.id || item.slug}`,
    source: 'remoteok',
    title: item.position || '',
    company: item.company || null,
    location: item.location || 'Remote',
    region: 'remote',
    description: item.description || null,
    url: item.url || `https://remoteok.com/remote-jobs/${item.slug}`,
    salary,
    jobType: 'FULL_TIME',
    category: Array.isArray(item.tags) ? item.tags[0] || null : null,
    postedAt: item.date ? new Date(item.date) : null,
    active: true,
    fetchedAt: new Date(),
  }
}

// ─── Main handler ──────────────────────────────────────────────────────────────

async function upsertJobs(jobs: any[], upserted: { n: number }, errors: { n: number }, fetchErrors: string[]) {
  for (const job of jobs) {
    if (!job.url) continue
    try {
      await prisma.job.upsert({
        where: { externalId: job.externalId },
        update: { fetchedAt: job.fetchedAt, active: true },
        create: job,
      })
      upserted.n++
    } catch (e: any) {
      errors.n++
      fetchErrors.push(`upsert(${job.externalId}): ${e?.message}`)
    }
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const upserted = { n: 0 }
  const errors   = { n: 0 }
  const fetchErrors: string[] = []

  // 1. Job Bank Canada
  for (const { fprov, region } of JB_PROVINCES) {
    const { items, error } = await fetchJobBank(fprov)
    if (error) fetchErrors.push(error)
    await upsertJobs(items.map(i => parseJobBankItem(i, region)), upserted, errors, fetchErrors)
  }

  // 2. Adzuna
  for (const { where, region } of ADZUNA_CITIES) {
    const { items, error } = await fetchAdzuna(where, region)
    if (error) fetchErrors.push(error)
    await upsertJobs(items.map(parseAdzunaItem), upserted, errors, fetchErrors)
  }

  // 3. RemoteOK
  const { items: roItems, error: roError } = await fetchRemoteOK()
  if (roError) fetchErrors.push(roError)
  await upsertJobs(roItems.map(parseRemoteOKItem), upserted, errors, fetchErrors)

  // 30일 지난 항목 비활성화
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)
  await prisma.job.updateMany({
    where: { fetchedAt: { lt: cutoff } },
    data: { active: false },
  })

  return NextResponse.json({ upserted: upserted.n, errors: errors.n, fetchErrors })
}
