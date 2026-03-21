'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Users, FileText, ShoppingBag, MessageSquare, TrendingUp, Home, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const PageTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: 800;
    color: #1a1f2e;
    margin-bottom: 1.5rem;
`

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;

    @media (min-width: 640px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(5, 1fr);
    }
`

const StatCard = styled.div<{ $accent: string }>`
    background: white;
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border-left: 4px solid ${({ $accent }) => $accent};
`

const StatLabel = styled.div`
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`

const StatValue = styled.div`
    font-size: 1.75rem;
    font-weight: 800;
    color: #1a1f2e;
`

const StatSub = styled.div`
    font-size: 0.8rem;
    color: #10b981;
    font-weight: 500;
`

const ChartCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`

const ChartTitle = styled.div`
    font-size: 1rem;
    font-weight: 700;
    color: #1a1f2e;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`

const BottomGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.5rem;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`

const InfoCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.625rem 0;
    border-bottom: 1px solid #f3f4f6;
    font-size: 0.9rem;

    &:last-child { border-bottom: none; }
`

const InfoKey = styled.span`color: #6b7280;`
const InfoVal = styled.span`font-weight: 600; color: #1a1f2e;`

export default function AdminOverview() {
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        fetch('/api/admin/stats').then(r => r.json()).then(setData)
    }, [])

    if (!data) return <div style={{ color: '#6b7280' }}>불러오는 중...</div>

    const stats = [
        { label: '오늘 방문자', value: data.todayVisitors, sub: '오늘 접속한 사용자', icon: Activity, accent: '#ef4444' },
        { label: '전체 사용자', value: data.totalUsers, sub: `이번달 +${data.newUsersThisMonth}`, icon: Users, accent: '#6366f1' },
        { label: '전체 게시물', value: data.totalPosts, icon: FileText, accent: '#f59e0b' },
        { label: '중고거래', value: data.totalProducts, icon: ShoppingBag, accent: '#10b981' },
        { label: '부동산 매물', value: data.totalProperties, icon: Home, accent: '#3b82f6' },
    ]

    return (
        <>
            <PageTitle>대시보드 개요</PageTitle>

            <StatsGrid>
                {stats.map(({ label, value, sub, icon: Icon, accent }) => (
                    <StatCard key={label} $accent={accent}>
                        <StatLabel>{label}</StatLabel>
                        <StatValue>{value.toLocaleString()}</StatValue>
                        {sub && <StatSub>{sub}</StatSub>}
                    </StatCard>
                ))}
            </StatsGrid>

            <ChartCard>
                <ChartTitle>
                    <TrendingUp size={18} color="#6366f1" />
                    월별 신규 가입자 추이 (최근 6개월)
                </ChartTitle>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data.userGrowth} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} name="신규 가입" />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <BottomGrid>
                <InfoCard>
                    <ChartTitle><MessageSquare size={18} color="#10b981" /> 채팅 현황</ChartTitle>
                    <InfoRow><InfoKey>전체 채팅방</InfoKey><InfoVal>{data.totalChatRooms.toLocaleString()}개</InfoVal></InfoRow>
                    <InfoRow><InfoKey>전체 메시지</InfoKey><InfoVal>{data.totalMessages.toLocaleString()}개</InfoVal></InfoRow>
                </InfoCard>
                <InfoCard>
                    <ChartTitle><Users size={18} color="#6366f1" /> 사용자 현황</ChartTitle>
                    <InfoRow><InfoKey>오늘 방문자</InfoKey><InfoVal style={{ color: '#ef4444' }}>{data.todayVisitors.toLocaleString()}명</InfoVal></InfoRow>
                    <InfoRow><InfoKey>전체 가입자</InfoKey><InfoVal>{data.totalUsers.toLocaleString()}명</InfoVal></InfoRow>
                    <InfoRow><InfoKey>이번달 신규</InfoKey><InfoVal>{data.newUsersThisMonth.toLocaleString()}명</InfoVal></InfoRow>
                </InfoCard>
            </BottomGrid>
        </>
    )
}
