'use client'

import { signIn } from 'next-auth/react'
import styled from 'styled-components'
import { MessageCircle } from 'lucide-react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: 1rem;
`

const Logo = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  letter-spacing: -1px;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 3rem;
  text-align: center;
  line-height: 1.5;
`

const KakaoButton = styled.button`
  background-color: #FEE500;
  color: #000000;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  max-width: 320px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`

const GoogleButton = styled.button`
  background-color: #FFFFFF;
  color: #757575;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  max-width: 320px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);

  &:hover {
    background-color: #f9f9f9;
  }
`

export default function LoginPage() {
  return (
    <Container>
      <Logo>KorCan</Logo>
      <Description>
        캐나다 한인들을 위한<br />
        필수 유틸리티 & 커뮤니티
      </Description>

      <GoogleButton onClick={() => signIn('google', { callbackUrl: '/' })}>
        <img src="/google-logo.png" alt="Google" style={{ width: 20, height: 20 }} onError={(e) => {
          // Fallback to text icon or SVGs if image fails
          e.currentTarget.style.display = 'none'
        }} />
        {/* Fallback SVG if image invalid */}
        <span style={{ marginLeft: '0.5rem' }}>구글로 시작하기</span>
      </GoogleButton>

      <div style={{ height: '0.75rem' }} />

      <KakaoButton onClick={() => signIn('kakao', { callbackUrl: '/' })}>
        <MessageCircle size={20} fill="black" />
        카카오로 시작하기
      </KakaoButton>
    </Container>
  )
}
