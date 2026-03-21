import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '로그인',
  description: 'KorCan에 로그인하고 캐나다 한인 커뮤니티에 참여하세요.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
