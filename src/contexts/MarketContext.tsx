'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { format } from 'date-fns'

export interface Product {
    id: string
    title: string
    price: number
    description: string
    category: string
    imageUrl?: string
    seller: string
    date: string
    status: 'selling' | 'reserved' | 'sold'
    likes: number
}

interface MarketContextType {
    products: Product[]
    addProduct: (title: string, price: number, description: string, category: string, imageUrl?: string) => void
    markAsSold: (id: string) => void
    likeProduct: (id: string) => void
    getProduct: (id: string) => Product | undefined
}

const MarketContext = createContext<MarketContextType | undefined>(undefined)

// Mock Data seed
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1', title: '아이폰 14 프로 맥스', price: 1200, description: '상태 S급입니다. 박스 풀셋.',
        category: 'Digital', seller: '김철수', date: '2026-02-05', status: 'selling', likes: 5, imageUrl: 'https://placehold.co/400x400/png?text=iPhone'
    },
    {
        id: '2', title: '이케아 책상', price: 50, description: '이사가서 팝니다. 직접 가져가셔야 해요.',
        category: 'Furniture', seller: '이영희', date: '2026-02-06', status: 'selling', likes: 12, imageUrl: 'https://placehold.co/400x400/png?text=Desk'
    }
]

export function MarketProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([])

    // Fetch Products
    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data)
                }
            })
            .catch(e => console.error(e))
    }, [])

    const addProduct = async (title: string, price: number, description: string, category: string, imageUrl?: string) => {
        // Optimistic
        const tempId = crypto.randomUUID()
        const newProduct: Product = {
            id: tempId,
            title,
            price,
            description,
            category,
            imageUrl: imageUrl || `https://placehold.co/400x400/png?text=${title.slice(0, 2)}`,
            seller: 'Me', // Placeholder until refresh
            date: format(new Date(), 'yyyy-MM-dd'),
            status: 'selling',
            likes: 0
        }
        setProducts(prev => [newProduct, ...prev])

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, price, description, category, imageUrl })
            })
            if (res.ok) {
                const saved = await res.json()
                setProducts(prev => prev.map(p => p.id === tempId ? {
                    ...p,
                    id: saved.id,
                    seller: saved.seller,
                    date: saved.date
                } : p))
            }
        } catch (e) {
            console.error(e)
        }
    }

    const markAsSold = async (id: string) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'sold' } : p))
        try {
            await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'sold' })
            })
        } catch (e) { console.error(e) }
    }

    const likeProduct = async (id: string) => {
        // We need a like endpoint. For now, optimistic update only?
        // Or create /api/products/[id]/like
        setProducts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))
        // TODO: Implement API
    }

    const getProduct = (id: string) => products.find(p => p.id === id)

    return (
        <MarketContext.Provider value={{ products, addProduct, markAsSold, likeProduct, getProduct }}>
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
