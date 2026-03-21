import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '좋아요',
  description: '내가 좋아요한 게시물과 매물을 모아보세요.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
