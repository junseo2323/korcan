import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '글쓰기',
  description: '커뮤니티에 글을 작성하고 이웃과 소통하세요.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
