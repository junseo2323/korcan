'use client'

import { Toaster } from 'sonner'

import { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
import GlobalStyles from '@/styles/GlobalStyles'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { ExpenseProvider } from '@/contexts/ExpenseContext'
import { TodoProvider } from '@/contexts/TodoContext'
import { PostProvider } from '@/contexts/PostContext'
import { MarketProvider } from '@/contexts/MarketContext'

import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider theme={theme}>
                <CurrencyProvider>
                    <ExpenseProvider>
                        <TodoProvider>
                            <PostProvider>
                                <MarketProvider>
                                    <GlobalStyles />
                                    <Toaster richColors position="top-center" />
                                    {children}
                                </MarketProvider>
                            </PostProvider>
                        </TodoProvider>
                    </ExpenseProvider>
                </CurrencyProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}
