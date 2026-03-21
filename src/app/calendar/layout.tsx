import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '캘린더',
  description: '일정과 할 일을 관리하는 KorCan 캘린더입니다.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
