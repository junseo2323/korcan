'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface Product {
    id: string
    title: string
    price: number
    description: string
    category: string
    imageUrl?: string
    sellerId: string
    seller: {
        name: string | null
        image: string | null
    }
    createdAt: string
    status: 'SELLING' | 'RESERVED' | 'SOLD'
    _count: {
        likes: number
    }
}

interface MarketContextType {
    products: Product[]
    regionFilter: string
    setRegionFilter: (r: string) => void
    refreshProducts: () => void
    addProduct: (title: string, price: number, description: string, category: string, imageUrl?: string, contactType?: string, contactValue?: string) => Promise<boolean>
}

const MarketContext = createContext<MarketContextType | undefined>(undefined)

export function MarketProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    const userRegion = (session?.user as any)?.region as string | undefined

    const [regionFilter, setRegionFilter] = useState<string>('All')
    const [regionInitialized, setRegionInitialized] = useState(false)
    const [products, setProducts] = useState<Product[]>([])

    // 세션 로드 완료 후 유저 지역으로 초기화 (최초 1회)
    useEffect(() => {
        if (!regionInitialized && userRegion) {
            setRegionFilter(userRegion)
            setRegionInitialized(true)
        }
    }, [userRegion, regionInitialized])

    const fetchProducts = useCallback(async (region: string) => {
        try {
            const params = new URLSearchParams()
            if (region && region !== 'All') params.set('region', region)
            const res = await fetch(`/api/products?${params.toString()}`)
            if (res.ok) setProducts(await res.json())
        } catch (e) {
            console.error(e)
        }
    }, [])

    useEffect(() => {
        fetchProducts(regionFilter)
    }, [regionFilter, fetchProducts])

    const refreshProducts = useCallback(() => {
        fetchProducts(regionFilter)
    }, [regionFilter, fetchProducts])

    const addProduct = async (title: string, price: number, description: string, category: string, imageUrl?: string, contactType?: string, contactValue?: string) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, price, description, category, imageUrl, contactType, contactValue })
            })
            if (res.ok) {
                fetchProducts(regionFilter)
                return true
            }
            return false
        } catch (e) {
            console.error(e)
            return false
        }
    }

    return (
        <MarketContext.Provider value={{ products, regionFilter, setRegionFilter, refreshProducts, addProduct }}>
            {children}
        </MarketContext.Provider>
    )
}

export function useMarket() {
    const context = useContext(MarketContext)
    if (context === undefined) {
        throw new Error('useMarket must be used within a MarketProvider')
    }
    return context
}
