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
}

interface PostContextType {
    posts: Post[]
    refreshPosts: () => void
    addPost: (title: string, content: string, category?: string) => Promise<void>
    updatePost: (id: string, updates: Partial<Post>) => void
}

const PostContext = createContext<PostContextType | undefined>(undefined)

export function PostProvider({ children }: { children: React.ReactNode }) {
    const [posts, setPosts] = useState<Post[]>([])

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts')
            if (res.ok) {
                const data = await res.json()
                setPosts(data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const refreshPosts = () => {
        fetchPosts()
    }

    const addPost = async (title: string, content: string, category: string = '일반') => {
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, category })
            })
            if (res.ok) {
                fetchPosts()
            } else {
                throw new Error('Failed to create post')
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
        <PostContext.Provider value={{ posts, refreshPosts, addPost, updatePost }}>
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
