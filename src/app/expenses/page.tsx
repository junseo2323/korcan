'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
// import ExpenseForm from '@/components/expenses/ExpenseForm' // Removed form
import ExpenseList from '@/components/expenses/ExpenseList'
import ExpenseDashboardHeader from '@/components/expenses/ExpenseDashboardHeader'
import WeeklyCalendarStrip from '@/components/expenses/WeeklyCalendarStrip'
import QuickAddRow from '@/components/expenses/QuickAddRow'
import AnalysisDashboard from '@/components/expenses/AnalysisDashboard'
import { useExpenses } from '@/hooks/useExpenses'
import { useCurrency } from '@/contexts/CurrencyContext'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
`

const AnalysisContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'analysis'>('list')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { expenses } = useExpenses()
  const { convert, currency } = useCurrency()

  // Calculate total for header
  const totalAmount = expenses.reduce((sum, e) => sum + convert(e.amount, e.currency, currency), 0)

  return (
    <PageContainer>
      <ExpenseDashboardHeader
        totalAmount={totalAmount}
        currency={currency}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'list' ? (
        <>
          <WeeklyCalendarStrip
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <div style={{ height: '0.5rem', backgroundColor: '#F4F6FA' }} />
          <QuickAddRow selectedDate={selectedDate} />
          <ExpenseList selectedDate={selectedDate} />
        </>
      ) : (
        <AnalysisContainer>
          <AnalysisDashboard />
        </AnalysisContainer>
      )}

    </PageContainer>
  )
}
