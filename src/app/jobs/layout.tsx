import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '일자리',
  description: '캐나다 한인을 위한 구인구직 정보. Job Bank, Indeed에서 최신 채용 공고를 모아드립니다.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
