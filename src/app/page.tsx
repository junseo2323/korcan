'use client'

import styled from 'styled-components'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`

const Title = styled.h1`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.primary};
`

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.secondary};
`

export default function Home() {
  return (
    <Main>
      <Title>KorCan</Title>
      <Subtitle>캐나다 한인 커뮤니티</Subtitle>
    </Main>
  )
}
