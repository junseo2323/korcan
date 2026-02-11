'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import TopHeader from './TopHeader'
import BottomNavigation from './BottomNavigation'
import { Toaster } from 'sonner'
import { ChatProvider } from '@/contexts/ChatContext'
import ChatPopup from '@/components/chat/ChatPopup'
import styled from 'styled-components'

const MobileWrapper = styled.div<{ $isAuthPage: boolean }>`
  padding-top: ${({ $isAuthPage }) => $isAuthPage ? '0' : '60px'};
  padding-bottom: ${({ $isAuthPage }) => $isAuthPage ? '0' : '80px'};
  min-height: 100vh;
  position: relative;
`

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // Check if path is login or register
    const isAuthPage = pathname === '/login' || pathname === '/register'

    return (
        <ChatProvider>
            {!isAuthPage && <TopHeader />}
            <MobileWrapper $isAuthPage={isAuthPage}>
                {children}
            </MobileWrapper>
            {!isAuthPage && <BottomNavigation />}
            <ChatPopup />
            <Toaster position="top-center" />
        </ChatProvider>
    )
}
