'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { format, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CalendarGrid from '@/components/calendar/CalendarGrid'
import TodoListView from '@/components/calendar/TodoListView'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 120px);
  background-color: ${({ theme }) => theme.colors.background.primary};

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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date()) // For Month Navigation
  const [selectedDate, setSelectedDate] = useState(new Date()) // For Selected Day

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  return (
    <PageContainer>
      <LeftPanel>
        <MonthNavigation>
          <NavButton onClick={handlePrevMonth}><ChevronLeft size={24} /></NavButton>
          <MonthTitle>{format(currentDate, 'yyyy년 M월')}</MonthTitle>
          <NavButton onClick={handleNextMonth}><ChevronRight size={24} /></NavButton>
        </MonthNavigation>

        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </LeftPanel>

      <RightPanel>
        <TodoListView selectedDate={selectedDate} />
      </RightPanel>
    </PageContainer>
  )
}
