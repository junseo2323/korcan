
'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { Megaphone, Flame, MessageCircle, ThumbsUp } from 'lucide-react'
import { Post } from '@/contexts/PostContext'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
`

const Card = styled.div<{ $type: 'notice' | 'hot' }>`
    background-color: ${({ $type }) => $type === 'notice' ? '#f0f9ff' : '#fff1f2'};
    border: 1px solid ${({ $type }) => $type === 'notice' ? '#bae6fd' : '#fecdd3'};
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &:active {
        transform: scale(0.98);
    }
`

const BadgeRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`

const Badge = styled.span<{ $type: 'notice' | 'hot' }>`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 6px;
    color: ${({ $type }) => $type === 'notice' ? '#0369a1' : '#be123c'};
    background-color: ${({ $type }) => $type === 'notice' ? '#e0f2fe' : '#ffe4e6'};
`

const Title = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
`

const Preview = styled.p`
    font-size: 0.85rem;
    color: #4b5563;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
`

const MetaRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
`

const IconText = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
`

export default function FeaturedPosts() {
    const router = useRouter()
    const [featured, setFeatured] = useState<{ notice: Post | null, hot: Post | null }>({ notice: null, hot: null })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const res = await fetch('/api/posts/featured')
                if (res.ok) {
                    const data = await res.json()
                    setFeatured(data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchFeatured()
    }, [])

    if (loading) return null // Or a skeleton

    return (
        <Container>
            {featured.notice && (
                <Card $type="notice" onClick={() => router.push(`/community/${featured.notice!.id}`)}>
                    <BadgeRow>
                        <Badge $type="notice"><Megaphone size={12} /> 공지</Badge>
                        <Title>{featured.notice.title}</Title>
                    </BadgeRow>
                    <Preview>{featured.notice.content}</Preview>
                    <MetaRow>
                        <span>{featured.notice.category === '공지' ? '관리자' : (featured.notice.user?.name || '익명')}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <IconText><ThumbsUp size={12} /> {featured.notice._count.likes}</IconText>
                            <IconText><MessageCircle size={12} /> {featured.notice._count.comments}</IconText>
                        </div>
                    </MetaRow>
                </Card>
            )}

            {featured.hot && (
                <Card $type="hot" onClick={() => router.push(`/community/${featured.hot!.id}`)}>
                    <BadgeRow>
                        <Badge $type="hot"><Flame size={12} /> HOT</Badge>
                        <Title>{featured.hot.title}</Title>
                    </BadgeRow>
                    <Preview>{featured.hot.content}</Preview>
                    <MetaRow>
                        <span>{featured.hot.user?.name || '익명'}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <IconText><ThumbsUp size={12} /> {featured.hot._count.likes}</IconText>
                            <IconText><MessageCircle size={12} /> {featured.hot._count.comments}</IconText>
                        </div>
                    </MetaRow>
                </Card>
            )}
        </Container>
    )
}
