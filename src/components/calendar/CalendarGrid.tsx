'use client'

import React from 'react'
import styled from 'styled-components'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useTodo } from '@/contexts/TodoContext'

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: transparent;
`

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
`

const DayLabel = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0.5rem 0;
`

const GridBody = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
`

const DayCell = styled.div<{ $isCurrentMonth: boolean; $isSelected: boolean }>`
  aspect-ratio: 1; /* Square cells */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 0.5rem;
  cursor: pointer;
  position: relative;
  
  opacity: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 1 : 0.3)};
  
  /* Selection Circle (Background) */
  &::before {
    content: '';
    position: absolute;
    top: 4px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${({ theme, $isSelected }) => ($isSelected ? theme.colors.neutral.gray200 : 'transparent')};
    z-index: 0;
  }
`

const DateNum = styled.span<{ $isToday: boolean; $isSelected: boolean }>`
  font-size: 1rem;
  font-weight: ${({ $isToday }) => ($isToday ? 'bold' : 'normal')};
  color: ${({ theme, $isToday }) => ($isToday ? theme.colors.primary : theme.colors.text.primary)};
  z-index: 1;
`

const DotsContainer = styled.div`
  display: flex;
  gap: 3px;
  margin-top: 4px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 80%;
`

const Dot = styled.div<{ $completed: boolean; $color: string }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${({ theme, $completed, $color }) =>
    $completed ? theme.colors.neutral.gray300 : ($color || theme.colors.secondary)};
`

interface Props {
  currentDate: Date
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export default function CalendarGrid({ currentDate, selectedDate, onSelectDate }: Props) {
  const { getTodosByDate } = useTodo()

  // Generate Calendar Days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <GridContainer>
      <WeekRow>
        {weekDays.map(d => <DayLabel key={d}>{d}</DayLabel>)}
      </WeekRow>

      <GridBody>
        {days.map((date, idx) => {
          const dateStr = format(date, 'yyyy-MM-dd')
          const todos = getTodosByDate(dateStr)
          const incompleteCount = todos.filter(t => !t.completed).length

          return (
            <DayCell
              key={idx}
              $isCurrentMonth={isSameMonth(date, monthStart)}
              $isSelected={isSameDay(date, selectedDate)}
              onClick={() => onSelectDate(date)}
            >
              <DateNum
                $isToday={isSameDay(date, new Date())}
                $isSelected={isSameDay(date, selectedDate)}
              >
                {format(date, 'd')}
              </DateNum>
              <DotsContainer>
                {todos.slice(0, 4).map(todo => (
                  <Dot
                    key={todo.id}
                    $completed={todo.completed}
                    $color={todo.color || ''}
                  />
                ))}
                {todos.length > 4 && <span style={{ fontSize: '6px', lineHeight: '4px' }}>+</span>}
              </DotsContainer>
            </DayCell>
          )
        })}
      </GridBody>
    </GridContainer>
  )
}
