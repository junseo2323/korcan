'use client'

import React, { useMemo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useCurrency } from '@/contexts/CurrencyContext'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

async function fetchRateForDate(dateStr: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateStr}/v1/currencies/cad.json`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.cad?.krw ?? null
  } catch {
    return null
  }
}

const Card = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); /* Soft shadow */
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`

const CurrentRate = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: baseline;
  gap: 0.5rem;

  span {
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`

const TargetPrice = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.25rem;
  
  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`

const RecommendationBadge = styled.div<{ $type: 'buy' | 'wait' | 'bad' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-weight: 600;
  font-size: 0.8rem;
  
  ${({ $type, theme }) => {
    if ($type === 'buy') return `
      background-color: #ecfdf5;
      color: #059669; /* Green */
    `
    if ($type === 'bad') return `
      background-color: #fef2f2;
      color: #dc2626; /* Red */
    `
    return `
      background-color: #f3f4f6;
      color: #4b5563; /* Gray */
    `
  }}
`

const GraphContainer = styled.div`
  height: 150px;
  margin-top: 1rem;
`

export default function ExchangeRateInsight() {
  const { exchangeRate } = useCurrency()
  const [historyData, setHistoryData] = useState<{ day: string; rate: number }[]>([])

  useEffect(() => {
    async function loadHistory() {
      const today = new Date()
      const dates = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(today)
        d.setDate(today.getDate() - (6 - i))
        return d.toISOString().slice(0, 10)
      })

      const results = await Promise.all(dates.map(fetchRateForDate))

      const past = dates.map((dateStr, i) => ({
        day: `D-${6 - i}`,
        rate: results[i] ?? exchangeRate,
      }))

      setHistoryData([...past, { day: 'Today', rate: exchangeRate }])
    }

    if (exchangeRate) loadHistory()
  }, [exchangeRate])

  // Calculate 7-day Average from real data
  const avgRate = useMemo(() => {
    if (historyData.length === 0) return exchangeRate
    const sum = historyData.reduce((acc, curr) => acc + curr.rate, 0)
    return sum / historyData.length
  }, [historyData, exchangeRate])

  // AI Target: Slightly below average (e.g., bottom 20% percentile logic simulated)
  const targetPrice = avgRate - 5

  let recommendation: 'buy' | 'wait' | 'bad' = 'wait'
  let message = '지켜보세요'
  let Icon = Minus

  if (exchangeRate < targetPrice) {
    recommendation = 'buy'
    message = '추천 (저점)'
    Icon = TrendingDown
  } else if (exchangeRate > avgRate + 10) {
    recommendation = 'bad'
    message = '비추천'
    Icon = TrendingUp
  }

  // Custom Dot Component with Ripple Effect
  const CustomDot = (props: any) => {
    const { cx, cy, index, payload } = props
    if (payload.day === 'Today') {
      return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} style={{ overflow: 'visible' }}>
          <defs>
            <style>
              {`
                @keyframes ripple {
                  0% {
                    r: 4px;
                    opacity: 1;
                    stroke-width: 0;
                  }
                  100% {
                    r: 12px;
                    opacity: 0;
                    stroke-width: 0;
                  }
                }
                .ripple-circle {
                  animation: ripple 1.5s infinite ease-out;
                  transform-origin: center;
                }
              `}
            </style>
          </defs>
          {/* Ripple Effect Circle */}
          <circle cx="10" cy="10" r="4" fill="#ef4444" className="ripple-circle" />
          {/* Main Dot */}
          <circle cx="10" cy="10" r="4" fill="#ef4444" stroke="white" strokeWidth="2" />
        </svg>
      )
    }
    return null
  }

  return (
    <Card>
      <Header>
        <div>
          <Title>🇨🇦 스마트 환율 진단</Title>
          <CurrentRate>
            {exchangeRate.toFixed(2)} <span>KRW/CAD</span>
          </CurrentRate>
          <TargetPrice>
            AI 추천 매수가: <strong>{targetPrice.toFixed(0)}원</strong> 이하
          </TargetPrice>
        </div>
        <RecommendationBadge $type={recommendation}>
          <Icon size={16} />
          {message}
        </RecommendationBadge>
      </Header>

      <GraphContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData.length > 0 ? historyData : [{ day: 'Today', rate: exchangeRate }]}>
            <XAxis dataKey="day" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={CustomDot} // Pass function component
            />
          </LineChart>
        </ResponsiveContainer>
      </GraphContainer>
    </Card>
  )
}
