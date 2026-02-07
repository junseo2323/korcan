'use client'

import React from 'react'
import styled from 'styled-components'
import { Bell, User } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 1000;
`

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.5px;
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const ExchangeRateBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const IconButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
  }
`

const ToggleButton = styled.button<{ $active: boolean }>`
    background-color: ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
    color: ${({ theme, $active }) => $active ? 'white' : theme.colors.text.secondary};
    border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.neutral.gray300};
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: none;
    }
    &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
`

const ToggleGroup = styled.div`
    display: flex;
    align-items: center;
`

import { signIn, signOut, useSession } from 'next-auth/react'

export default function TopHeader() {
  const { exchangeRate, currency, setCurrency } = useCurrency()
  const { data: session } = useSession()

  return (
    <HeaderContainer>
      <Logo>KorCan</Logo>
      <RightSection>
        {/* Toggle Group code remains same, omitted for brevity if no changes needed there, but providing full block for safety or just the changed parts */}
        <ToggleGroup>
          <ToggleButton $active={currency === 'KRW'} onClick={() => setCurrency('KRW')}>KRW</ToggleButton>
          <ToggleButton $active={currency === 'CAD'} onClick={() => setCurrency('CAD')}>CAD</ToggleButton>
        </ToggleGroup>

        <ExchangeRateBadge>
          <span>🇨🇦 $1</span>
          <span style={{ color: '#ccc' }}>|</span>
          <span>₩{exchangeRate}</span>
        </ExchangeRateBadge>

        {session ? (
          <IconButton onClick={() => signOut()} aria-label="Sign Out">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                style={{ width: 24, height: 24, borderRadius: '50%' }}
              />
            ) : (
              <User size={20} />
            )}
          </IconButton>
        ) : (
          <button
            onClick={() => signIn('kakao')}
            style={{
              backgroundColor: '#FEE500',
              color: '#000000',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            카카오 로그인
          </button>
        )}
      </RightSection>
    </HeaderContainer>
  )
}
