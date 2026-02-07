'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const ClockContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 12px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`

const ZoneBlock = styled.div<{ $isPrimary?: boolean }>`
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${({ theme, $isPrimary }) =>
    $isPrimary ? theme.colors.primary + '10' : 'transparent'};
`

const ZoneLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const TimeDisplay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`

const DateDisplay = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.8;
`

export default function WorldClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const renderClock = (zone: string, label: string, isPrimary: boolean = false) => {
    const zonedDate = toZonedTime(now, zone)
    return (
      <ZoneBlock $isPrimary={isPrimary}>
        <ZoneLabel>{label}</ZoneLabel>
        <TimeDisplay>{format(zonedDate, 'HH:mm')}</TimeDisplay>
        <DateDisplay>{format(zonedDate, 'MMM d, yyyy (E)')}</DateDisplay>
      </ZoneBlock>
    )
  }

  return (
    <ClockContainer>
      {renderClock('America/Toronto', '🇨🇦 Toronto', true)}
      <div style={{ fontSize: '1.5rem', opacity: 0.3 }}>vs</div>
      {renderClock('Asia/Seoul', '🇰🇷 Seoul')}
    </ClockContainer>
  )
}
