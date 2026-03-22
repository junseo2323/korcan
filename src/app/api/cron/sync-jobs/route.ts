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

// ─── CanKorJobs (cankorjobs.ca) ────────────────────────────────────────────────

const CANKOR_URL  = 'https://zcdinzncxvpthtvwcypd.supabase.co/rest/v1/job_posts'
const CANKOR_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZGluem5jeHZwdGh0dndjeXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTU3NjMsImV4cCI6MjA4MjA5MTc2M30.hl9lmcEgYYkfgYPV-5jx6PQxAGgZS189nDRFNr_8q4s'

const CANKOR_CITY_MAP: Record<string, string> = {
  toronto:   'on',
  vancouver: 'bc',
  calgary:   'ab',
  edmonton:  'ab',
  montreal:  'qc',
  ottawa:    'on',
  winnipeg:  'mb',
  halifax:   'ns',
}

async function fetchCanKorJobs(): Promise<{ items: any[], error?: string }> {
  try {
    const res = await fetch(
      `${CANKOR_URL}?select=id,title,company_name,description,service_city,city,province,employment_type,pay_type,pay_min,pay_max,apply_email,apply_phone,apply_link,created_at&status=eq.open&limit=500`,
      { headers: { apikey: CANKOR_KEY, Authorization: `Bearer ${CANKOR_KEY}` } }
    )
    if (!res.ok) return { items: [], error: `cankorjobs: HTTP ${res.status}` }
    return { items: await res.json() }
  } catch (e: any) {
    return { items: [], error: `cankorjobs: ${e?.message}` }
  }
}

function parseCanKorJobsItem(item: any) {
  const serviceCity = item.service_city?.toLowerCase() || ''
  const region = CANKOR_CITY_MAP[serviceCity] || 'on'
  const location = [item.city, item.province].filter(Boolean).join(', ') || item.service_city || null

  let salary: string | null = null
  if (item.pay_min > 0 || item.pay_max > 0) {
    salary = item.pay_min > 0 && item.pay_max > 0
      ? `$${item.pay_min}–$${item.pay_max}`
      : item.pay_min > 0 ? `$${item.pay_min}+` : null
  }

  const applyUrl = item.apply_link
    || (item.apply_email ? `mailto:${item.apply_email}` : null)
    || `https://cankorjobs.ca/${serviceCity}/jobs`

  return {
    externalId: `cankorjobs_${item.id}`,
    source: 'cankorjobs',
    title: item.title || '',
    company: item.company_name || null,
    location,
    region,
    description: item.description || null,
    url: applyUrl,
    salary,
    jobType: item.employment_type === 'full_time' ? 'FULL_TIME'
           : item.employment_type === 'part_time' ? 'PART_TIME' : null,
    category: '한인업체',
    postedAt: item.created_at ? new Date(item.created_at) : null,
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

  // 3. CanKorJobs (한인 채용)
  const { items: ckItems, error: ckError } = await fetchCanKorJobs()
  if (ckError) fetchErrors.push(ckError)
  await upsertJobs(ckItems.map(parseCanKorJobsItem), upserted, errors, fetchErrors)

  // 4. RemoteOK
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
