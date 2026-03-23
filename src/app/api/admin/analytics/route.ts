import { BetaAnalyticsDataClient, protos } from '@google-analytics/data'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

const PROPERTY_ID = '529258217'

function getClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set')
  const credentials = JSON.parse(raw)
  return new BetaAnalyticsDataClient({ credentials })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const client = getClient()

    const [sources, pages, countries, daily] = await Promise.all([
      // 유입 소스 (30일)
      client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'newUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 15,
      }),
      // 인기 페이지 (30일)
      client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      // 국가별 (30일)
      client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 8,
      }),
      // 일별 세션 (14일)
      client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate: '13daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date', orderType: 'ALPHANUMERIC' }, desc: false }],
      }),
    ])

    const toRows = (res: protos.google.analytics.data.v1beta.IRunReportResponse) =>
      (res.rows ?? []).map(row => ({
        dims: row.dimensionValues?.map(d => d.value ?? '') ?? [],
        vals: row.metricValues?.map(m => Number(m.value ?? 0)) ?? [],
      }))

    return NextResponse.json({
      sources: toRows(sources[0] ?? {}),
      pages: toRows(pages[0] ?? {}),
      countries: toRows(countries[0] ?? {}),
      daily: toRows(daily[0] ?? {}),
    })
  } catch (e: any) {
    if (e.message === 'GOOGLE_SERVICE_ACCOUNT_JSON not set') {
      return NextResponse.json({ error: 'credentials_missing' }, { status: 503 })
    }
    console.error('[analytics]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
