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
  height: calc(100vh - 120px); /* Adjust for header/nav */
  background-color: ${({ theme }) => theme.colors.background.primary};
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

      <TodoListView selectedDate={selectedDate} />
    </PageContainer>
  )
}
