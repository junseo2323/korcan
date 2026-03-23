'use client'

import React, { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Search, MapPin, ExternalLink, Briefcase, X, Calendar, Tag, ChevronRight } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
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
  { value: 'cankorjobs', label: '🇰🇷 한인' },
]

const SOURCE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  jobbank:    { bg: '#dbeafe', color: '#1d4ed8', label: 'Job Bank' },
  adzuna:     { bg: '#dcfce7', color: '#166534', label: 'Adzuna' },
  remoteok:   { bg: '#f3e8ff', color: '#7e22ce', label: 'RemoteOK' },
  cankorjobs: { bg: '#fff1f2', color: '#be123c', label: '🇰🇷 한인' },
}

// ─── List styles ──────────────────────────────────────────────────────────────

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

const JobCard = styled.div`
  display: block;
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
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
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.25rem;
`

const MetaLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
`

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
`

const MetaRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  white-space: nowrap;
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

// ─── Detail Modal styles ───────────────────────────────────────────────────────

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  animation: ${fadeIn} 0.2s ease;
  display: flex;
  align-items: flex-end;

  @media (min-width: 768px) {
    align-items: center;
    justify-content: center;
  }
`

const Sheet = styled.div`
  background: white;
  width: 100%;
  max-height: 90vh;
  border-radius: 24px 24px 0 0;
  overflow-y: auto;
  animation: ${slideUp} 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  @media (min-width: 768px) {
    max-width: 600px;
    max-height: 80vh;
    border-radius: 20px;
    animation: ${fadeIn} 0.2s ease;
  }
`

const SheetHandle = styled.div`
  width: 40px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin: 12px auto 0;

  @media (min-width: 768px) {
    display: none;
  }
`

const SheetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem 1.25rem 0;
  gap: 0.75rem;
`

const SheetTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
  flex: 1;
`

const CloseBtn = styled.button`
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  color: #64748b;
  &:hover { background: #e2e8f0; }
`

const SheetBody = styled.div`
  padding: 1rem 1.25rem 1.5rem;
`

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:last-of-type { border-bottom: none; }

  svg { flex-shrink: 0; color: #94a3b8; }
`

const DetailLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  min-width: 52px;
`

const Description = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 240px;
  overflow-y: auto;
`

const ApplyBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 14px;
  text-decoration: none;
  transition: opacity 0.15s;

  &:hover { opacity: 0.9; }
  &:active { opacity: 0.8; }
`

// ─── Component ────────────────────────────────────────────────────────────────

export default function JobsClient() {
  const [jobs, setJobs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [region, setRegion] = useState('')
  const [source, setSource] = useState('')
  const [keyword, setKeyword] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedJob, setSelectedJob] = useState<any>(null)

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

  const jobTypeLabel = (t: string | null) => {
    if (t === 'FULL_TIME') return '정규직'
    if (t === 'PART_TIME') return '파트타임'
    if (t === 'CONTRACT') return '계약직'
    return t
  }

  return (
    <PageContainer>
      <PageTitle>💼 일자리</PageTitle>

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
              <JobCard key={job.id} onClick={() => setSelectedJob(job)}>
                <JobHeader>
                  <JobTitle>{job.title}</JobTitle>
                  <SourceBadge $source={job.source}>{sourceLabel(job.source)}</SourceBadge>
                </JobHeader>
                <JobMeta>
                  <MetaLeft>
                    {job.company && <MetaItem><Briefcase size={13} />{job.company}</MetaItem>}
                    {job.location && <MetaItem><MapPin size={13} />{job.location}</MetaItem>}
                    <MetaItem>💰 {job.salary || '협의 후 결정'}</MetaItem>
                  </MetaLeft>
                  <MetaRight>
                    {job.postedAt && (
                      <span>{formatDistanceToNow(new Date(job.postedAt), { addSuffix: true, locale: ko })}</span>
                    )}
                    <ChevronRight size={13} />
                  </MetaRight>
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

      {/* Job Detail Modal */}
      {selectedJob && (
        <Overlay onClick={() => setSelectedJob(null)}>
          <Sheet onClick={e => e.stopPropagation()}>
            <SheetHandle />
            <SheetHeader>
              <SheetTitle>{selectedJob.title}</SheetTitle>
              <CloseBtn onClick={() => setSelectedJob(null)}>
                <X size={16} />
              </CloseBtn>
            </SheetHeader>

            <SheetBody>
              <div style={{ marginBottom: '0.75rem' }}>
                <SourceBadge $source={selectedJob.source}>
                  {sourceLabel(selectedJob.source)}
                </SourceBadge>
              </div>

              {selectedJob.company && (
                <DetailRow>
                  <Briefcase size={16} />
                  <DetailLabel>회사</DetailLabel>
                  <span>{selectedJob.company}</span>
                </DetailRow>
              )}
              {selectedJob.location && (
                <DetailRow>
                  <MapPin size={16} />
                  <DetailLabel>위치</DetailLabel>
                  <span>{selectedJob.location}</span>
                </DetailRow>
              )}
              <DetailRow>
                <span style={{ fontSize: '1rem' }}>💰</span>
                <DetailLabel>급여</DetailLabel>
                <span>{selectedJob.salary || '협의 후 결정'}</span>
              </DetailRow>
              {selectedJob.jobType && (
                <DetailRow>
                  <Tag size={16} />
                  <DetailLabel>고용형태</DetailLabel>
                  <span>{jobTypeLabel(selectedJob.jobType)}</span>
                </DetailRow>
              )}
              {selectedJob.category && (
                <DetailRow>
                  <Tag size={16} />
                  <DetailLabel>직종</DetailLabel>
                  <span>{selectedJob.category}</span>
                </DetailRow>
              )}
              {selectedJob.postedAt && (
                <DetailRow>
                  <Calendar size={16} />
                  <DetailLabel>등록일</DetailLabel>
                  <span>{format(new Date(selectedJob.postedAt), 'yyyy년 M월 d일', { locale: ko })}</span>
                </DetailRow>
              )}

              {selectedJob.description && (
                <Description>{selectedJob.description.replace(/<[^>]+>/g, '').trim()}</Description>
              )}

              <ApplyBtn href={selectedJob.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} />
                지원하기
              </ApplyBtn>
            </SheetBody>
          </Sheet>
        </Overlay>
      )}
    </PageContainer>
  )
}
