'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, endOfWeek, isSameMonth } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useExpenses } from '@/hooks/useExpenses'
import { useCurrency } from '@/contexts/CurrencyContext'
import { ChevronDown, ChevronUp } from 'lucide-react'

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  padding-bottom: 0.5rem;
`

const Grid = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  transition: all 0.3s ease;
  max-height: ${({ $expanded }) => ($expanded ? '400px' : '90px')};
  overflow: hidden;
`

const DayColumn = styled.div<{ $isToday?: boolean; $isSelected?: boolean; $isCurrentMonth?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  opacity: ${({ $isCurrentMonth }) => ($isCurrentMonth === false ? 0.3 : 1)};
`

const DayName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const DateNum = styled.span<{ $isToday?: boolean; $isSelected?: boolean }>`
  font-size: 16px;
  font-weight: ${({ $isToday, $isSelected }) => ($isToday || $isSelected ? 'bold' : 'normal')};
  color: ${({ theme, $isSelected }) => ($isSelected ? 'white' : theme.colors.text.primary)};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme, $isToday, $isSelected }) =>
    $isSelected
      ? theme.colors.primary
      : $isToday
        ? theme.colors.neutral.gray200
        : 'transparent'};
  transition: all 0.2s;
`

const AmountLabel = styled.span<{ $type: 'income' | 'expense' }>`
  font-size: 10px;
  color: ${({ theme, $type }) => ($type === 'income' ? theme.colors.primary : theme.colors.text.secondary)};
  font-weight: ${({ $type }) => ($type === 'income' ? 'bold' : 'normal')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`

const ToggleButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  outline: none;
  
  &:hover {
      color: ${({ theme }) => theme.colors.primary};
  }
`

interface Props {
  selectedDate: Date | null
  onSelectDate: (date: Date | null) => void
}

export default function WeeklyCalendarStrip({ selectedDate, onSelectDate }: Props) {
  const { expenses } = useExpenses()
  const { convert, currency } = useCurrency()
  const [isExpanded, setIsExpanded] = useState(false)

  const today = new Date()

  // Calculate days to show
  let days = []

  if (isExpanded) {
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    let currentDate = startDate
    while (currentDate <= endDate) {
      days.push(currentDate)
      currentDate = addDays(currentDate, 1)
    }
  } else {
    const start = startOfWeek(today, { weekStartsOn: 0 })
    days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  const handleDateClick = (day: Date) => {
    if (selectedDate && isSameDay(day, selectedDate)) {
      onSelectDate(null) // Deselect
    } else {
      onSelectDate(day)
    }
  }

  return (
    <Container>
      <Grid $expanded={isExpanded}>
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dailyExpenses = expenses.filter(e => e.date === dateStr)
          const total = dailyExpenses.reduce((sum, e) => sum + convert(e.amount, e.currency, currency), 0)

          const isToday = isSameDay(day, today)
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isCurrentMonth = isSameMonth(day, today)

          return (
            <DayColumn
              key={dateStr}
              $isToday={isToday}
              $isSelected={isSelected}
              $isCurrentMonth={isCurrentMonth}
              onClick={() => handleDateClick(day)}
            >
              <DayName>{format(day, 'E', { locale: ko })}</DayName>
              <DateNum $isToday={isToday} $isSelected={isSelected}>
                {format(day, 'd')}
              </DateNum>
              {total > 0 && (
                <AmountLabel $type="expense">
                  -{Math.round(total).toLocaleString()}
                </AmountLabel>
              )}
            </DayColumn>
          )
        })}
      </Grid>
      <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </ToggleButton>
    </Container>
  )
}
