import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '가계부',
  description: '캐나다 생활비를 한눈에 관리하는 KorCan 가계부입니다.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
