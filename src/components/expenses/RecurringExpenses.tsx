'use client'

import React from 'react'
import styled from 'styled-components'
import { useExpenses } from '@/hooks/useExpenses'
import { Calendar, CreditCard, Plus } from 'lucide-react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`

const ScrollArea = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  /* Hide scrollbar for clean look */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const Card = styled.div`
  min-width: 160px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
`

const Name = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Amount = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
`

const DDay = styled.div`
  margin-top: auto;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.status.warning};
  background-color: #fffbeb;
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
`

const AddButton = styled.button`
  min-width: 50px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`

interface Props {
  onManageClick: () => void
}

export default function RecurringExpenses({ onManageClick }: Props) {
  const { recurringRules } = useExpenses()

  const getDDay = (frequency: string, day: number) => {
    const today = new Date().getDate()
    let diff = day - today
    if (diff < 0) diff += 30 // Rough approximation

    if (diff === 0) return 'D-Day'
    return `D-${diff}`
  }

  return (
    <Container>
      <Header>
        <Title>💳 정기 구독 & 고정 지출</Title>
      </Header>

      <ScrollArea>
        {recurringRules.map(rule => (
          <Card key={rule.id}>
            <IconBox>
              <CreditCard size={20} />
            </IconBox>
            <Info>
              <Name>{rule.note}</Name>
              <Amount>
                {rule.currency === 'CAD' ? '$' : '₩'}
                {rule.amount.toLocaleString()}
              </Amount>
            </Info>
            <DDay>{getDDay(rule.frequency, rule.day)}</DDay>
          </Card>
        ))}

        <AddButton onClick={onManageClick}>
          <Plus size={24} />
        </AddButton>
      </ScrollArea>
    </Container>
  )
}
