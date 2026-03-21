'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import TopHeader from './TopHeader'
import BottomNavigation from './BottomNavigation'
import { Toaster } from 'sonner'
import { ChatProvider } from '@/contexts/ChatContext'
import ChatPopup from '@/components/chat/ChatPopup'
import ServiceWorkerRegistrar from '@/components/pwa/ServiceWorkerRegistrar'
import PushPermissionPrompt from '@/components/pwa/PushPermissionPrompt'
import InstallPrompt from '@/components/pwa/InstallPrompt'
import styled from 'styled-components'

const MobileWrapper = styled.div<{ $isAuthPage: boolean }>`
  padding-top: ${({ $isAuthPage }) => $isAuthPage ? '0' : '60px'};
  padding-bottom: ${({ $isAuthPage }) => $isAuthPage ? '0' : 'calc(90px + env(safe-area-inset-bottom))'};
  min-height: 100vh;
  position: relative;
`

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const isAuthPage = pathname === '/login' || pathname === '/register'

    useEffect(() => {
        if (session?.user) {
            fetch('/api/ping', { method: 'POST' })
        }
    }, [session?.user])

    return (
        <ChatProvider>
            {!isAuthPage && <TopHeader />}
            <MobileWrapper $isAuthPage={isAuthPage}>
                {children}
            </MobileWrapper>
            {!isAuthPage && <BottomNavigation />}
            <ChatPopup />
            <ServiceWorkerRegistrar />
            <PushPermissionPrompt />
            <InstallPrompt />
            <Toaster position="top-center" />
        </ChatProvider>
    )
}
