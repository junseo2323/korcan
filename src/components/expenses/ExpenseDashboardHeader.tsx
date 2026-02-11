'use client'

import React from 'react'
import styled from 'styled-components'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { useCurrency } from '@/contexts/CurrencyContext'

const Container = styled.div`
  padding: 1rem 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
`

const HeaderTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    margin-bottom: 1rem;
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
  transition: color 0.2s;
`

const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 800;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
`

const HeroAmount = styled.div`
  padding: 0 1rem;
  margin-bottom: 0.5rem;
`

const BigAmount = styled.h1`
  font-size: 2.25rem;
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

const ToggleButton = styled.button<{ $active: boolean }>`
    background-color: ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
    color: ${({ theme, $active }) => $active ? 'white' : theme.colors.text.secondary};
    border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.neutral.gray300};
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: none;
    }
    &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
`

const ToggleGroup = styled.div`
    display: flex;
    align-items: center;
`

const ExchangeRateInfo = styled.div`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-top: 4px;
    text-align: right;
`

interface HeaderProps {
  totalAmount: number
  currency: 'CAD' | 'KRW'
  activeTab: 'list' | 'analysis'
  onTabChange: (tab: 'list' | 'analysis') => void
}

export default function ExpenseDashboardHeader({ totalAmount, currency, activeTab, onTabChange }: HeaderProps) {
  const { setCurrency, exchangeRate } = useCurrency()
  const today = new Date()

  // Formatting currency
  const formattedAmount = totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })
  const symbol = currency === 'CAD' ? '$' : '₩'

  return (
    <Container>
      <HeaderTop>
        <MonthNav>
          <ChevronLeft size={24} color="#888" />
          <span>{format(today, 'M월')}</span>
          <ChevronRight size={24} color="#888" />
        </MonthNav>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <ToggleGroup>
            <ToggleButton $active={currency === 'KRW'} onClick={() => setCurrency('KRW')}>KRW</ToggleButton>
            <ToggleButton $active={currency === 'CAD'} onClick={() => setCurrency('CAD')}>CAD</ToggleButton>
          </ToggleGroup>
          <ExchangeRateInfo>
            1 CAD = {exchangeRate} KRW
          </ExchangeRateInfo>
        </div>
      </HeaderTop>

      <HeroAmount>
        <Subtext>이번 달 쓴 금액</Subtext>
        <BigAmount>
          {formattedAmount}{symbol}
        </BigAmount>
      </HeroAmount>

      <Tabs>
        <Tab $active={activeTab === 'list'} onClick={() => onTabChange('list')}>내 소비</Tab>
        <Tab $active={activeTab === 'analysis'} onClick={() => onTabChange('analysis')}>소비 분석</Tab>
      </Tabs>
    </Container>
  )
}
