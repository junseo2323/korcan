'use client'

import React from 'react'
import styled from 'styled-components'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const Container = styled.div`
  padding: 1rem 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
`

const Tabs = styled.div`
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.colors.neutral.gray200};
  margin-bottom: 1.5rem;
`

const Tab = styled.div<{ $active?: boolean }>`
  flex: 1;
  text-align: center;
  padding: 0.75rem;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  color: ${({ theme, $active }) => ($active ? theme.colors.text.primary : theme.colors.text.secondary)};
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.colors.text.primary : 'transparent')};
  margin-bottom: -2px; /* Overlap border */
  cursor: pointer;
  
  /* Toss reference: "내 소비" (My Consumption), "카드 추천" (Card Rec) */
`

const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
`

const HeroAmount = styled.div`
  padding: 0 1rem;
  margin-bottom: 0.5rem;
`

const BigAmount = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Subtext = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.primary}; /* Blue text for "spending less" */
  font-weight: 500;
`

interface HeaderProps {
  totalAmount: number
  currency: 'CAD' | 'KRW'
  activeTab: 'list' | 'analysis'
  onTabChange: (tab: 'list' | 'analysis') => void
}

export default function ExpenseDashboardHeader({ totalAmount, currency, activeTab, onTabChange }: HeaderProps) {
  const today = new Date()

  // Formatting currency
  const formattedAmount = totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })
  const symbol = currency === 'CAD' ? '$' : '₩'

  return (
    <Container>
      <Tabs>
        <Tab $active={activeTab === 'list'} onClick={() => onTabChange('list')}>내 소비</Tab>
        <Tab $active={activeTab === 'analysis'} onClick={() => onTabChange('analysis')}>소비 분석</Tab>
      </Tabs>

      <MonthNav>
        <ChevronLeft size={20} color="#888" />
        <span>{format(today, 'M월')}</span>
        <ChevronRight size={20} color="#888" />
      </MonthNav>

      <HeroAmount>
        <BigAmount>
          {formattedAmount}{symbol}
          {/* Chevron down could go here */}
        </BigAmount>
        <Subtext>지난달보다 0원 덜 쓰는 중</Subtext>
      </HeroAmount>
    </Container>
  )
}
