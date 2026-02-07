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

export default function LoginPage() {
    return (
        <Container>
            <Logo>KorCan</Logo>
            <Description>
                캐나다 한인들을 위한<br />
                필수 유틸리티 & 커뮤니티
            </Description>

            <KakaoButton onClick={() => signIn('kakao', { callbackUrl: '/' })}>
                <MessageCircle size={20} fill="black" />
                카카오로 시작하기
            </KakaoButton>
        </Container>
    )
}
