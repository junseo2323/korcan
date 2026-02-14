'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import CategoryChart from '@/components/expenses/charts/CategoryChart'
import ExchangeRateInsight from '@/components/expenses/ExchangeRateInsight'
import RecurringExpenses from '@/components/expenses/RecurringExpenses'
import SpendingInsight from '@/components/expenses/SpendingInsight'
import FixedExpenseManager from '@/components/expenses/FixedExpenseManager'
import { useExpenses } from '@/hooks/useExpenses'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Settings } from 'lucide-react'

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 600px; /* Wanted style is usually narrow/mobile-first or focused */
  margin: 0 auto;
  padding-bottom: 100px;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`

const ManageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.gray200};
  }
`

export default function AnalysisDashboard() {
  const { expenses } = useExpenses()
  const { convert, currency } = useCurrency()
  const [showManageFixed, setShowManageFixed] = useState(false)

  // Calculate total spending for the current month
  const currentMonth = new Date().getMonth()
  const monthlyExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentMonth)
  const totalAmount = monthlyExpenses.reduce((sum, e) => sum + convert(e.amount, e.currency, currency), 0)

  return (
    <DashboardContainer>
      {/* 1. Smart Exchange Rate (Top Priority) */}
      <ExchangeRateInsight />

      {/* 2. Recurring Expenses */}
      <Section>
        <SectionHeader>
          <SectionTitle>정기 지출</SectionTitle>
          <ManageButton onClick={() => setShowManageFixed(!showManageFixed)}>
            <Settings size={16} />
            {showManageFixed ? '닫기' : '관리'}
          </ManageButton>
        </SectionHeader>

        {showManageFixed ? (
          <FixedExpenseManager />
        ) : (
          <RecurringExpenses onManageClick={() => setShowManageFixed(true)} />
        )}
      </Section>

      {/* 3. Spending Insights (Fun) */}
      <SpendingInsight totalAmount={totalAmount} currency={currency} />

      {/* 4. Category Chart */}
      <Section>
        <SectionTitle>카테고리별 지출</SectionTitle>
        <CategoryChart />
      </Section>

    </DashboardContainer>
  )
}
