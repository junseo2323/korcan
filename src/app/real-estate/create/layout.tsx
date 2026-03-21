import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '매물 등록',
  description: '캐나다 부동산 매물을 KorCan에 등록해보세요.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
