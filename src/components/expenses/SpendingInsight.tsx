'use client'

import React from 'react'
import styled from 'styled-components'
import { Utensils, Coffee, AlertCircle, Smile } from 'lucide-react'

const Card = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  opacity: 0.9;
`

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
`

const StatBox = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

const StatIcon = styled.div`
  font-size: 1.5rem;
`

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
`

const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
`

const Commentary = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

interface Props {
    totalAmount: number // Always in CAD for unified logic, or handle currency
    currency: 'CAD' | 'KRW'
}

export default function SpendingInsight({ totalAmount, currency }: Props) {
    // Conversion Rates (Approx)
    // Chicken: $30 CAD / 30,000 KRW
    // Coffee: $5 CAD / 5,000 KRW

    const amountInCAD = currency === 'CAD' ? totalAmount : totalAmount / 950

    const chickenCount = Math.floor(amountInCAD / 30)
    const coffeeCount = Math.floor(amountInCAD / 5)

    let comment = "지갑이 평온하네요 🧘"
    let Icon = Smile

    if (amountInCAD > 2000) {
        comment = "이번 달 숨만 쉬어야 해요... 😭"
        Icon = AlertCircle
    } else if (amountInCAD > 1000) {
        comment = "적당히 썼지만, 아껴보면 어떨까요? 🤔"
        Icon = AlertCircle
    } else if (amountInCAD > 500) {
        comment = "아직은 여유가 있어요! 💸"
        Icon = Smile
    }

    return (
        <Card>
            <Header>
                <Title>🍗 소비 전투력 측정</Title>
            </Header>

            <StatGrid>
                <StatBox>
                    <StatIcon>🍗</StatIcon>
                    <StatValue>{chickenCount}마리</StatValue>
                    <StatLabel>치킨 지수</StatLabel>
                </StatBox>
                <StatBox>
                    <StatIcon>☕️</StatIcon>
                    <StatValue>{coffeeCount}잔</StatValue>
                    <StatLabel>커피 지수</StatLabel>
                </StatBox>
            </StatGrid>

            <Commentary>
                <Icon size={18} />
                {comment}
            </Commentary>
        </Card>
    )
}
