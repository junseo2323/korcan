'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { addHours, format, startOfHour, isSameHour } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 12px;
  overflow: hidden;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.white};
  font-weight: bold;
  text-align: center;
`

const ScrollArea = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

const TimeRow = styled.div<{ $selected: boolean; $isNight: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  cursor: pointer;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.secondary + '15' : 'transparent'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary + '10'};
  }
`

const TimeCell = styled.div<{ $isGoodTime?: boolean }>`
  text-align: center;
  display: flex;
  flex-direction: column;
  opacity: ${({ $isGoodTime }) => ($isGoodTime ? 1 : 0.5)};
  color: ${({ theme }) => theme.colors.text.primary};
`

const TimeText = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
`

const DateText = styled.span`
  font-size: 0.8rem;
  opacity: 0.7;
`

const ActionArea = styled.div`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
`

const CopyButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text.white};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.secondary}dd;
  }
`

export default function TimezoneComparator() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Start from current hour
  const start = startOfHour(new Date())

  // Generate next 24 hours
  const hours = Array.from({ length: 24 }, (_, i) => addHours(start, i))

  const isGoodTime = (date: Date, zone: string) => {
    const zoned = toZonedTime(date, zone)
    const h = zoned.getHours()
    // Assume 8am to 11pm is "awake"
    return h >= 8 && h <= 23
  }

  const handleCopy = () => {
    if (!selectedDate) return

    const toronto = format(toZonedTime(selectedDate, 'America/Toronto'), 'MMM d, h:mm a')
    const seoul = format(toZonedTime(selectedDate, 'Asia/Seoul'), 'MMM d, h:mm a')

    const text = `Let's meet!\n🇨🇦 Toronto: ${toronto}\n🇰🇷 Seoul: ${seoul}`
    navigator.clipboard.writeText(text)
    alert('Time copied to clipboard!')
  }

  return (
    <Container>
      <Header>
        <div>🇨🇦 Toronto</div>
        <div>🇰🇷 Seoul</div>
      </Header>
      <ScrollArea>
        {hours.map((date) => {
          const isSelected = selectedDate ? isSameHour(date, selectedDate) : false
          const torontoZoned = toZonedTime(date, 'America/Toronto')
          const seoulZoned = toZonedTime(date, 'Asia/Seoul')

          const torontoGood = isGoodTime(date, 'America/Toronto')
          const seoulGood = isGoodTime(date, 'Asia/Seoul')

          return (
            <TimeRow
              key={date.toISOString()}
              $selected={isSelected}
              $isNight={!torontoGood || !seoulGood}
              onClick={() => setSelectedDate(date)}
            >
              <TimeCell $isGoodTime={torontoGood}>
                <TimeText>{format(torontoZoned, 'h:mm a')}</TimeText>
                <DateText>{format(torontoZoned, 'MMM d')}</DateText>
              </TimeCell>
              <TimeCell $isGoodTime={seoulGood}>
                <TimeText>{format(seoulZoned, 'h:mm a')}</TimeText>
                <DateText>{format(seoulZoned, 'MMM d')}</DateText>
              </TimeCell>
            </TimeRow>
          )
        })}
      </ScrollArea>
      <ActionArea>
        {selectedDate ? (
          <CopyButton onClick={handleCopy}>
            Copy Schedule
          </CopyButton>
        ) : (
          <div style={{ opacity: 0.6, padding: '0.75rem' }}>Select a time slot above</div>
        )}
      </ActionArea>
    </Container>
  )
}
