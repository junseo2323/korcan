'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

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
    refreshProducts: () => void
    addProduct: (title: string, price: number, description: string, category: string, imageUrl?: string) => Promise<boolean>
}

const MarketContext = createContext<MarketContextType | undefined>(undefined)

export function MarketProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            if (res.ok) {
                const data = await res.json()
                setProducts(data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const refreshProducts = useCallback(() => {
        fetchProducts()
    }, [])

    const addProduct = async (title: string, price: number, description: string, category: string, imageUrl?: string) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, price, description, category, imageUrl })
            })
            if (res.ok) {
                fetchProducts()
                return true
            }
            return false
        } catch (e) {
            console.error(e)
            return false
        }
    }

    return (
        <MarketContext.Provider value={{ products, refreshProducts, addProduct }}>
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
