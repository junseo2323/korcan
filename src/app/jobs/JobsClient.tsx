'use client'

import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Search, MapPin, ExternalLink, Briefcase } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

const REGIONS = [
  { value: '', label: '전체 지역' },
  { value: 'bc', label: '🌊 BC (밴쿠버)' },
  { value: 'on', label: '🏙 ON (토론토)' },
  { value: 'ab', label: '🏔 AB (캘거리)' },
  { value: 'qc', label: '⚜️ QC (몬트리올)' },
  { value: 'mb', label: '🌾 MB (위니펙)' },
  { value: 'ns', label: '🌊 NS (핼리팩스)' },
  { value: 'remote', label: '🌐 리모트' },
]

const SOURCES = [
  { value: '', label: '모든 출처' },
  { value: 'jobbank', label: 'Job Bank' },
  { value: 'adzuna', label: 'Adzuna' },
  { value: 'remoteok', label: 'RemoteOK' },
]

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem 6rem;
`

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`

const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`

const SearchInput = styled.div`
  flex: 1;
  min-width: 180px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 10px;
  padding: 0.5rem 0.75rem;

  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.primary};
    background: transparent;
  }
`

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 10px;
  background: white;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  outline: none;
`

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const JobCard = styled.a`
  display: block;
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;

  &:active {
    transform: scale(0.99);
  }

  @media (min-width: 768px) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
  }
`

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

const JobTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
`

const SOURCE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  jobbank:  { bg: '#dbeafe', color: '#1d4ed8', label: 'Job Bank' },
  adzuna:   { bg: '#dcfce7', color: '#166534', label: 'Adzuna' },
  remoteok: { bg: '#f3e8ff', color: '#7e22ce', label: 'RemoteOK' },
}

const SourceBadge = styled.span<{ $source: string }>`
  flex-shrink: 0;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background-color: ${({ $source }) => SOURCE_STYLE[$source]?.bg || '#f3f4f6'};
  color: ${({ $source }) => SOURCE_STYLE[$source]?.color || '#374151'};
`

const JobMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
`

const ExternalIcon = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const LoadMoreBtn = styled.button`
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 12px;
  background: white;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #f9fafb; }
  &:disabled { opacity: 0.5; cursor: default; }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`

export default function JobsClient() {
  const [jobs, setJobs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [region, setRegion] = useState('')
  const [source, setSource] = useState('')
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')

  const fetchJobs = useCallback(async (pg: number, reset: boolean) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pg),
        ...(region && { region }),
        ...(source && { source }),
        ...(keyword && { keyword }),
      })
      const res = await fetch(`/api/jobs?${params}`)
      if (!res.ok) return
      const data = await res.json()
      setJobs(prev => reset ? data.jobs : [...prev, ...data.jobs])
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }, [region, source, keyword])

  useEffect(() => {
    setPage(1)
    fetchJobs(1, true)
  }, [fetchJobs])

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    fetchJobs(next, false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setKeyword(inputValue)
  }

  const sourceLabel = (src: string) => SOURCE_STYLE[src]?.label || src

  return (
    <PageContainer>
      <PageTitle>💼 일자리</PageTitle>
      <PageSubtitle>Job Bank · Indeed에서 최신 공고를 모아드립니다</PageSubtitle>

      <FilterBar>
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 180, display: 'flex' }}>
          <SearchInput>
            <Search size={16} color="#9CA3AF" />
            <input
              placeholder="직책, 회사명 검색"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
          </SearchInput>
        </form>
        <Select value={region} onChange={e => setRegion(e.target.value)}>
          {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </Select>
        <Select value={source} onChange={e => setSource(e.target.value)}>
          {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </Select>
      </FilterBar>

      {jobs.length === 0 && !loading ? (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>아직 공고가 없어요</div>
          <div style={{ fontSize: '0.85rem' }}>곧 최신 채용 정보가 채워질 예정입니다.</div>
        </EmptyState>
      ) : (
        <>
          <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '0.75rem' }}>
            총 {total.toLocaleString()}개 공고
          </div>
          <JobList>
            {jobs.map((job: any) => (
              <JobCard key={job.id} href={job.url} target="_blank" rel="noopener noreferrer">
                <JobHeader>
                  <JobTitle>{job.title}</JobTitle>
                  <SourceBadge $source={job.source}>{sourceLabel(job.source)}</SourceBadge>
                </JobHeader>
                <JobMeta>
                  {job.company && <MetaItem><Briefcase size={13} />{job.company}</MetaItem>}
                  {job.location && <MetaItem><MapPin size={13} />{job.location}</MetaItem>}
                  {job.salary && <MetaItem>💰 {job.salary}</MetaItem>}
                  {job.postedAt && (
                    <MetaItem style={{ marginLeft: 'auto' }}>
                      {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true, locale: ko })}
                    </MetaItem>
                  )}
                  <ExternalIcon><ExternalLink size={14} /></ExternalIcon>
                </JobMeta>
              </JobCard>
            ))}
          </JobList>

          {jobs.length < total && (
            <LoadMoreBtn onClick={handleLoadMore} disabled={loading}>
              {loading ? '불러오는 중...' : '더 보기'}
            </LoadMoreBtn>
          )}
        </>
      )}
    </PageContainer>
  )
}
