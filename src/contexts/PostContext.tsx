'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { format } from 'date-fns'

export interface Post {
    id: string
    title: string
    content: string
    category: string
    views: number
    userId: string
    user: {
        name: string | null
        image: string | null
    }
    createdAt: string
    _count: {
        comments: number
        likes: number
    }
    meetup?: {
        id: string
        date: string
        maxMembers: number
        currentMembers: number
        status: string
        region: string
        image?: string | null
    } | null
}

interface PostContextType {
    posts: Post[]
    refreshPosts: () => void
    addPost: (title: string, content: string, category?: string, region?: string, meetupData?: any, images?: string[]) => Promise<void>
    updatePost: (id: string, updates: Partial<Post>) => void
    selectedRegion: string
    setSelectedRegion: (region: string) => void
}

const PostContext = createContext<PostContextType | undefined>(undefined)

export function PostProvider({ children }: { children: React.ReactNode }) {
    const [posts, setPosts] = useState<Post[]>([])
    const [selectedRegion, setSelectedRegion] = useState<string>('All')

    const fetchPosts = async (region?: string) => {
        try {
            const url = new URL('/api/posts', window.location.href)
            if (region && region !== 'All') {
                url.searchParams.set('region', region)
            }

            const res = await fetch(url.toString())
            if (res.ok) {
                const data = await res.json()
                setPosts(data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchPosts(selectedRegion)
    }, [selectedRegion])

    const refreshPosts = () => {
        fetchPosts(selectedRegion)
    }

    const addPost = async (title: string, content: string, category: string = '일반', region?: string, meetupData?: any, images?: string[]) => {
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, category, region, meetupData, images })
            })
            if (res.ok) {
                refreshPosts()
            } else {
                const errData = await res.json().catch(() => ({}))
                console.error('Server Error Details:', errData)
                throw new Error(errData.details || errData.error || 'Failed to create post')
            }
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    const updatePost = (id: string, updates: Partial<Post>) => {
        setPosts(prev => prev.map(post =>
            post.id === id ? { ...post, ...updates } : post
        ))
    }

    return (
        <PostContext.Provider value={{ posts, refreshPosts, addPost, updatePost, selectedRegion, setSelectedRegion }}>
            {children}
        </PostContext.Provider>
    )
}

export function usePosts() {
    const context = useContext(PostContext)
    if (context === undefined) {
        throw new Error('usePosts must be used within a PostProvider')
    }
    return context
}
