import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '물건 팔기',
  description: '안 쓰는 물건을 KorCan 중고거래에 올려보세요.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
