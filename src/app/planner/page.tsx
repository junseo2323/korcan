'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { format, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CalendarGrid from '@/components/calendar/CalendarGrid'
import TodoListView from '@/components/calendar/TodoListView'
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

const TopTabs = styled.div`
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border.primary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  position: sticky;
  top: 0;
  z-index: 10;
`

const TopTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.875rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.text.secondary};
  font-size: 0.95rem;
  font-weight: ${({ $active }) => $active ? '700' : '400'};
  cursor: pointer;
  transition: all 0.15s;
`

// --- Calendar styles ---

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 110px);

  @media (min-width: 768px) {
    flex-direction: row;
    height: calc(100vh - 60px);
  }
`

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    width: 420px;
    flex-shrink: 0;
    border-right: 1px solid ${({ theme }) => theme.colors.border.primary};
    overflow-y: auto;
  }
`

const RightPanel = styled.div`
  @media (min-width: 768px) {
    flex: 1;
    overflow-y: auto;
  }
`

const MonthNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
`

const MonthTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
`

// --- Expenses styles ---

const ExpenseContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (min-width: 768px) {
    flex-direction: row;
    height: calc(100vh - 120px);
  }
`

const ExpenseLeft = styled.div`
  @media (min-width: 768px) {
    width: 360px;
    flex-shrink: 0;
    border-right: 1px solid ${({ theme }) => theme.colors.border.primary};
    overflow-y: auto;
  }
`

const ExpenseRight = styled.div`
  @media (min-width: 768px) {
    flex: 1;
    overflow-y: auto;
  }
`

const AnalysisContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

function CalendarTab() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <CalendarContainer>
      <LeftPanel>
        <MonthNavigation>
          <NavButton onClick={() => setCurrentDate(subMonths(currentDate, 1))}><ChevronLeft size={24} /></NavButton>
          <MonthTitle>{format(currentDate, 'yyyy년 M월')}</MonthTitle>
          <NavButton onClick={() => setCurrentDate(addMonths(currentDate, 1))}><ChevronRight size={24} /></NavButton>
        </MonthNavigation>
        <CalendarGrid currentDate={currentDate} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </LeftPanel>
      <RightPanel>
        <TodoListView selectedDate={selectedDate} />
      </RightPanel>
    </CalendarContainer>
  )
}

function ExpensesTab() {
  const [activeTab, setActiveTab] = useState<'list' | 'analysis'>('list')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { expenses } = useExpenses()
  const { convert, currency } = useCurrency()
  const totalAmount = expenses.reduce((sum, e) => sum + convert(e.amount, e.currency, currency), 0)

  return (
    <>
      <ExpenseDashboardHeader
        totalAmount={totalAmount}
        currency={currency}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === 'list' ? (
        <ExpenseContentLayout>
          <ExpenseLeft>
            <WeeklyCalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </ExpenseLeft>
          <ExpenseRight>
            <div style={{ height: '0.5rem', backgroundColor: '#F4F6FA' }} />
            <QuickAddRow selectedDate={selectedDate} />
            <ExpenseList selectedDate={selectedDate} />
          </ExpenseRight>
        </ExpenseContentLayout>
      ) : (
        <AnalysisContainer>
          <AnalysisDashboard />
        </AnalysisContainer>
      )}
    </>
  )
}

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'expenses'>('calendar')

  return (
    <PageContainer>
      <TopTabs>
        <TopTab $active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')}>캘린더</TopTab>
        <TopTab $active={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')}>가계부</TopTab>
      </TopTabs>

      {activeTab === 'calendar' ? <CalendarTab /> : <ExpensesTab />}
    </PageContainer>
  )
}
