'use client'

import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale' // Ensure this is imported/used if needed
import { toZonedTime } from 'date-fns-tz' // Need to check if this lib is installed. 
// Actually date-fns-tz might not be installed. Let's use basic Intl for now or install it.
// The user has date-fns. Standard Intl.DateTimeFormat is safer without extra install.
import Link from 'next/link'
import { ChevronRight, Calendar, AlertCircle, PieChart } from 'lucide-react'

// --- Blocks Layout Components ---

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  padding-bottom: 80px; /* Nav space */
  max-width: 600px;
  margin: 0 auto;
`

export const FullWidthBlock = styled.div`
  grid-column: span 2;
`

const BlockBase = styled.div`
  background-color: white;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  /* border: 1px solid ${({ theme }) => theme.colors.neutral.gray200}; */
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.98);
  }
`

const BlockTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const BlockContent = styled.div`
  flex: 1;
`

// --- Timezone Widget ---

const TimeDisplay = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  
  &:last-child { margin-bottom: 0; }
`

const TimeLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const TimeValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  font-variant-numeric: tabular-nums;
`

const DateValue = styled.div`
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.text.primary};
    opacity: 0.7;
`

export function TimezoneBlock() {
    const [now, setNow] = useState(new Date())
    const [region, setRegion] = useState('America/Vancouver') // Default
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        const saved = localStorage.getItem('korcan_timezone_region')
        if (saved) setRegion(saved)

        const timer = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const handleRegionChange = (newRegion: string) => {
        setRegion(newRegion)
        localStorage.setItem('korcan_timezone_region', newRegion)
    }

    // Region Options
    const regions = [
        { label: '🇨🇦 밴쿠버', value: 'America/Vancouver' },
        { label: '🇨🇦 토론토', value: 'America/Toronto' },
        { label: '🇨🇦 캘거리', value: 'America/Edmonton' },
        { label: '🇨🇦 몬트리올', value: 'America/Toronto' }, // Same as Toronto time-wise usually
        { label: '🇨🇦 핼리팩스', value: 'America/Halifax' },
        { label: '🇨🇦 위니펙', value: 'America/Winnipeg' },
    ]

    const currentRegionLabel = regions.find(r => r.value === region)?.label || '🇨🇦 밴쿠버'

    // Formatter
    const formatTime = (date: Date, timeZone: string) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date)
    }

    const formatDate = (date: Date, timeZone: string) => {
        return new Intl.DateTimeFormat('ko-KR', {
            timeZone,
            month: 'short',
            day: 'numeric',
            weekday: 'short'
        }).format(date)
    }

    if (!isClient) return <BlockBase style={{ backgroundColor: '#F4F6FA', height: '146px' }} />

    return (
        <BlockBase style={{ backgroundColor: '#F4F6FA' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <BlockTitle style={{ marginBottom: 0 }}>🌏 시차 확인</BlockTitle>
                <select
                    value={region}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    style={{
                        fontSize: '0.8rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        border: '1px solid #ddd',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    {regions.map(r => (
                        <option key={r.label} value={r.value}>{r.label.split(' ')[1]}</option> // Show just city name in drop
                    ))}
                </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TimeDisplay>
                    <TimeLabel>{currentRegionLabel}</TimeLabel>
                    <TimeValue>{formatTime(now, region)}</TimeValue>
                    <DateValue>{formatDate(now, region)}</DateValue>
                </TimeDisplay>

                <div style={{ height: 40, width: 1, background: '#D1D5DB' }}></div>

                <TimeDisplay>
                    <TimeLabel>🇰🇷 서울</TimeLabel>
                    <TimeValue>{formatTime(now, 'Asia/Seoul')}</TimeValue>
                    <DateValue>{formatDate(now, 'Asia/Seoul')}</DateValue>
                </TimeDisplay>
            </div>
        </BlockBase>
    )
}

// --- Popular Posts Widget ---

const PostItem = styled(Link)`
  display: block;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.gray100};
  text-decoration: none;
  
  &:last-child { border-bottom: none; }
`

const PostTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const PostMeta = styled.div`
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    display: flex;
    gap: 0.5rem;
`

const Badge = styled.span`
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
`

export function PopularPostsBlock({ posts }: { posts: any[] }) {
    return (
        <BlockBase>
            <BlockTitle>🔥 지금 핫한 글</BlockTitle>
            <BlockContent>
                {posts.length > 0 ? posts.map((post, index) => (
                    <PostItem key={post.id} href={`/community/${post.id}`}>
                        <PostTitle>
                            {index < 3 && <span style={{ color: '#FF4D4D', marginRight: 4 }}>{index + 1}</span>}
                            {post.title}
                        </PostTitle>
                        <PostMeta>
                            <Badge>{post.category || '자유'}</Badge>
                            <span>좋아요 {post.likes}</span>
                            <span>댓글 {post.comments}</span>
                        </PostMeta>
                    </PostItem>
                )) : (
                    <div style={{ color: '#888', fontSize: '0.9rem', padding: '1rem 0' }}>인기 글이 없습니다.</div>
                )}
            </BlockContent>
        </BlockBase>
    )
}

// --- Today Schedule Widget ---

const ScheduleText = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text.primary};
    
    strong {
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 800;
    }
`

const LinkButton = styled(Link)`
    margin-top: 1rem;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    text-decoration: none;
    font-weight: 600;
`

export function TodayScheduleBlock({ count, userName }: { count: number, userName: string }) {
    return (
        <BlockBase>
            <BlockTitle><Calendar size={16} /> 오늘의 일정</BlockTitle>
            <BlockContent>
                {userName ? (
                    <ScheduleText>
                        {userName}님,<br />
                        오늘 남은 할 일이 <br />
                        <strong>{count}개</strong> 있어요.
                    </ScheduleText>
                ) : (
                    <ScheduleText>
                        로그인하고<br />
                        일정을 관리해보세요.
                    </ScheduleText>
                )}

                <LinkButton href="/calendar">
                    바로가기 <ChevronRight size={16} />
                </LinkButton>
            </BlockContent>
        </BlockBase>
    )
}

// --- Ad Widget ---

const AdContainer = styled.div`
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
    border-radius: 24px;
    padding: 1.5rem;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    min-height: 140px;
`

const AdBadge = styled.span`
    position: absolute;
    top: 1rem;
    left: 1rem;
    background-color: rgba(0,0,0,0.2);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 700;
`

const AdTitle = styled.div`
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
`

const AdDesc = styled.div`
    font-size: 0.9rem;
    opacity: 0.9;
`

export function AdBlock() {
    return (
        <AdContainer>
            <AdBadge>AD</AdBadge>
            <AdTitle>KorCan 프리미엄</AdTitle>
            <AdDesc>더 많은 기능을<br />준비하고 있습니다.</AdDesc>
            <div style={{ position: 'absolute', bottom: -10, right: -10, opacity: 0.2 }}>
                <AlertCircle size={80} />
            </div>
        </AdContainer>
    )
}

// --- Monthly Expense Widget ---

const ExpenseRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    &:last-child { margin-bottom: 0; }
`

const CurrencyLabel = styled.span`
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: 600;
`

const ExpenseAmount = styled.span<{ $length: number }>`
    font-size: ${({ $length }) => $length > 13 ? '0.85rem' : $length > 9 ? '0.95rem' : '1.1rem'};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.primary};
    transition: font-size 0.2s;
`

const ConvertedAmount = styled.span<{ $length: number }>`
    font-size: ${({ $length }) => $length > 13 ? '0.85rem' : $length > 9 ? '0.95rem' : '1.1rem'};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    transition: font-size 0.2s;
`

import { useCurrency } from '@/contexts/CurrencyContext'

export function MonthlyExpenseBlock({ expenses }: { expenses: { CAD: number, KRW: number } }) {
    const { exchangeRate } = useCurrency()

    // User wants to see CAD amount and its KRW equivalent
    const cadAmount = expenses?.CAD || 0
    const convertedKRW = cadAmount * exchangeRate

    const cadText = `$${cadAmount.toLocaleString()}`
    const krwText = `≈ ₩${Math.round(convertedKRW).toLocaleString()}`

    return (
        <BlockBase>
            <BlockTitle><PieChart size={16} /> 이번 달 지출</BlockTitle>
            <BlockContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <ExpenseRow>
                    <CurrencyLabel>CAD</CurrencyLabel>
                    <ExpenseAmount $length={cadText.length}>{cadText}</ExpenseAmount>
                </ExpenseRow>
                <ExpenseRow>
                    <CurrencyLabel>KRW (환산)</CurrencyLabel>
                    <ConvertedAmount $length={krwText.length}>{krwText}</ConvertedAmount>
                </ExpenseRow>
            </BlockContent>
            <LinkButton href="/expenses">
                내역 보기 <ChevronRight size={16} />
            </LinkButton>
        </BlockBase>
    )
}
