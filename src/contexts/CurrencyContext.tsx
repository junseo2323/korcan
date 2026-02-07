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
        // In a real app, fetch from an API like:
        // fetch('https://api.exchangerate-api.com/v4/latest/CAD')
        //   .then(res => res.json())
        //   .then(data => setExchangeRate(data.rates.KRW))
        // For MVP demo, setting a realistic static rate or simulating fetch
        const fetchRate = async () => {
            try {
                // Simulating API call
                // const res = await fetch('...') 
                // const data = await res.json()
                setExchangeRate(995.5) // Example live-ish rate
            } catch (e) {
                console.error('Failed to fetch rate, using default', e)
                setExchangeRate(DEFAULT_RATE)
            }
        }
        fetchRate()
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
