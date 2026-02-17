
'use client'

import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useSession } from 'next-auth/react'

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`

const fadeOut = keyframes`
  from { opacity: 1; visibility: visible; }
  to { opacity: 0; visibility: hidden; }
`

const Container = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${({ $isVisible }) => !$isVisible && fadeOut} 0.5s forwards;
  pointer-events: ${({ $isVisible }) => $isVisible ? 'all' : 'none'};
`

const LogoText = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -1px;
  animation: ${pulse} 2s infinite ease-in-out;
  margin-bottom: 1rem;
`

const SubText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 500;
`

export default function SplashScreen() {
  const { status } = useSession()
  const [isVisible, setIsVisible] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)
  const [minTimePassed, setMinTimePassed] = useState(false)

  // 1. Min time timer
  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // 2. Control Visibility: Wait for MinTime AND Auth Ready
  useEffect(() => {
    // Bypass if already seen
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash')
    if (hasSeenSplash) {
      setIsVisible(false)
      setShouldRender(false)
      return
    }

    if (minTimePassed && status !== 'loading') {
      setIsVisible(false)
      sessionStorage.setItem('hasSeenSplash', 'true')
      setTimeout(() => setShouldRender(false), 500)
    }
  }, [minTimePassed, status])

  if (!shouldRender) return null

  return (
    <Container $isVisible={isVisible}>
      <LogoText>KorCan</LogoText>
      <SubText>캐나다 한인 커뮤니티</SubText>
    </Container>
  )
}
