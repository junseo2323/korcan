'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  const router = useRouter()
  const { data: session, status } = useSession()
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false)

  // Auto-login for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && status === 'unauthenticated' && !autoLoginAttempted) {
      setAutoLoginAttempted(true)
      signIn('dev-auto-login', { callbackUrl: '/' })
    }
  }, [status, autoLoginAttempted])

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      router.push('/')
    }
  }, [session, router])

  // Show loading while auto-login is in progress
  if (process.env.NODE_ENV === 'development' && status === 'loading') {
    return (
      <Container>
        <Logo>KorCan</Logo>
        <Description>개발 모드: 자동 로그인 중...</Description>
      </Container>
    )
  }

  return (
    <Container>
      <Logo>KorCan</Logo>
      <Description>
        캐나다 한인들을 위한<br />
        필수 유틸리티 & 커뮤니티
      </Description>

      <GoogleButton onClick={() => signIn('google', { callbackUrl: '/' })}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        <span>구글로 시작하기</span>
      </GoogleButton>

      <div style={{ height: '0.75rem' }} />

      <KakaoButton onClick={() => signIn('kakao', { callbackUrl: '/' })}>
        <MessageCircle size={20} fill="black" />
        카카오로 시작하기
      </KakaoButton>
    </Container>
  )
}
