'use client'

import { useEffect, useState } from 'react'

interface AnalyticsData {
  sources: { dims: string[]; vals: number[] }[]
  pages: { dims: string[]; vals: number[] }[]
  countries: { dims: string[]; vals: number[] }[]
  daily: { dims: string[]; vals: number[] }[]
}

const MEDIUM_LABELS: Record<string, string> = {
  '(none)': '직접',
  referral: '추천',
  social: '소셜',
  organic: '검색',
  email: '이메일',
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => {
        if (d.error === 'credentials_missing') {
          setError('GOOGLE_SERVICE_ACCOUNT_JSON 환경변수가 설정되지 않았습니다.')
        } else if (d.error) {
          setError(d.error)
        } else {
          setData(d)
        }
      })
      .catch(() => setError('데이터를 불러오지 못했습니다.'))
  }, [])

  if (error) {
    return (
      <div style={{ padding: '2rem', background: '#fef2f2', borderRadius: 12, color: '#991b1b', lineHeight: 1.7 }}>
        <strong>애널리틱스 연동 필요</strong><br />
        {error}<br /><br />
        <code style={{ fontSize: '0.8rem', background: '#fee2e2', padding: '2px 6px', borderRadius: 4 }}>
          GOOGLE_SERVICE_ACCOUNT_JSON='{`{"type":"service_account",...}`}'
        </code>
        <br /><br />
        <span style={{ fontSize: '0.85rem', color: '#b91c1c' }}>
          Google Cloud Console → IAM → 서비스 계정 → 키 생성(JSON) 후 GA 속성에 뷰어 권한 부여
        </span>
      </div>
    )
  }

  if (!data) {
    return <div style={{ color: '#64748b', padding: '2rem' }}>불러오는 중...</div>
  }

  const totalSessions = data.sources.reduce((s, r) => s + r.vals[0], 0)
  const totalUsers = data.daily.length > 0
    ? Math.max(...data.daily.map(r => r.vals[1]))
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1f2e', margin: 0 }}>
        애널리틱스 <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#64748b' }}>최근 30일</span>
      </h1>

      {/* 요약 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { label: '총 세션', value: totalSessions.toLocaleString() },
          { label: '유입 소스', value: data.sources.length + '개' },
          { label: '방문 국가', value: data.countries.length + '개' },
          { label: '주요 페이지', value: data.pages.length + '개' },
        ].map(c => (
          <div key={c.label} style={{ background: 'white', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1f2e' }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* 일별 세션 */}
        <Card title="일별 세션 (14일)">
          <DailyChart rows={data.daily} />
        </Card>

        {/* 유입 소스 */}
        <Card title="유입 소스">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <Th>소스</Th><Th align="right">세션</Th><Th align="right">신규</Th>
              </tr>
            </thead>
            <tbody>
              {data.sources.slice(0, 10).map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.5rem 0', color: '#1e293b' }}>
                    <span style={{ color: '#64748b', marginRight: 4 }}>
                      {MEDIUM_LABELS[r.dims[1]] ?? r.dims[1]}
                    </span>
                    {r.dims[0]}
                  </td>
                  <Td>{r.vals[0].toLocaleString()}</Td>
                  <Td>{r.vals[2].toLocaleString()}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* 인기 페이지 */}
        <Card title="인기 페이지">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <Th>페이지</Th><Th align="right">PV</Th><Th align="right">유저</Th>
              </tr>
            </thead>
            <tbody>
              {data.pages.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.5rem 0', color: '#1e293b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.dims[0]}
                  </td>
                  <Td>{r.vals[0].toLocaleString()}</Td>
                  <Td>{r.vals[1].toLocaleString()}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* 국가별 */}
        <Card title="국가별 유저">
          {data.countries.map((r, i) => {
            const max = data.countries[0].vals[0]
            const pct = Math.round((r.vals[0] / max) * 100)
            return (
              <div key={i} style={{ marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 3 }}>
                  <span>{r.dims[0]}</span>
                  <span style={{ color: '#64748b' }}>{r.vals[0].toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99 }}>
                  <div style={{ height: 6, width: `${pct}%`, background: '#6366f1', borderRadius: 99 }} />
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1f2e', marginBottom: '1rem' }}>{title}</div>
      {children}
    </div>
  )
}

function Th({ children, align }: { children: React.ReactNode; align?: 'right' }) {
  return <th style={{ padding: '0.4rem 0', color: '#64748b', fontWeight: 500, textAlign: align ?? 'left' }}>{children}</th>
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '0.5rem 0', textAlign: 'right', color: '#64748b' }}>{children}</td>
}

function DailyChart({ rows }: { rows: { dims: string[]; vals: number[] }[] }) {
  if (!rows.length) return null
  const max = Math.max(...rows.map(r => r.vals[0]), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
      {rows.map((r, i) => {
        const pct = (r.vals[0] / max) * 100
        const date = r.dims[0] // YYYYMMDD
        const label = `${date.slice(4, 6)}/${date.slice(6, 8)}`
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{r.vals[0]}</div>
            <div style={{ width: '100%', background: '#e0e7ff', borderRadius: '4px 4px 0 0', height: `${Math.max(pct, 4)}%`, minHeight: 4 }}>
              <div style={{ width: '100%', height: '100%', background: '#6366f1', borderRadius: '4px 4px 0 0', opacity: 0.85 }} />
            </div>
            <div style={{ fontSize: '0.6rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{label}</div>
          </div>
        )
      })}
    </div>
  )
}
