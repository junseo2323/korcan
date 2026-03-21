import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '회원가입',
  description: 'KorCan 회원가입으로 캐나다 한인 커뮤니티에 함께하세요.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
