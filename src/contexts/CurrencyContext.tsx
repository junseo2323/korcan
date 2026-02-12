'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Currency = 'CAD' | 'KRW'

interface CurrencyContextType {
    currency: Currency
    exchangeRate: number // 1 CAD = X KRW
    toggleCurrency: () => void
    setCurrency: (currency: Currency) => void
    convert: (amount: number, from: Currency, to: Currency) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const DEFAULT_RATE = 980 // Fallback 1 CAD = 980 KRW

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('CAD')
    const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_RATE)

    useEffect(() => {
        const fetchRate = async () => {
            try {
                // Using a free exchange rate API (No key required for this specific endpoint usually, or uses public rate)
                // Alternative: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/cad.json
                const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/cad.json')

                if (res.ok) {
                    const data = await res.json()
                    // data.cad.krw
                    const rate = data.cad.krw
                    if (rate) {
                        setExchangeRate(rate)
                        console.log(`Updated Exchange Rate: 1 CAD = ${rate} KRW`)
                    }
                } else {
                    console.error('Exchange rate API error')
                }
            } catch (e) {
                console.error('Failed to fetch rate, using default', e)
                // Fallback is already set
            }
        }
        fetchRate()

        // Refresh every hour
        const interval = setInterval(fetchRate, 3600000)
        return () => clearInterval(interval)
    }, [])

    const toggleCurrency = () => {
        setCurrency((prev) => (prev === 'CAD' ? 'KRW' : 'CAD'))
    }

    const convert = (amount: number, from: Currency, to: Currency) => {
        if (from === to) return amount
        if (from === 'CAD' && to === 'KRW') return amount * exchangeRate
        if (from === 'KRW' && to === 'CAD') return amount / exchangeRate
        return amount
    }

    return (
        <CurrencyContext.Provider value={{ currency, exchangeRate, toggleCurrency, setCurrency, convert }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}
