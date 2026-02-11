'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { usePosts } from '@/contexts/PostContext'
import { useSession } from 'next-auth/react'
import { Plus, MessageCircle, ThumbsUp } from 'lucide-react'
import MeetupCard from '@/components/MeetupCard'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  padding-bottom: 80px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  min-height: 100vh;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
`

const WriteButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const PostCard = styled.div`
  background-color: white;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.1s;
  
  &:active { transform: scale(0.98); }
`

const PostTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const PostPreview = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.disabled};
`

const MetaLeft = styled.div`
  display: flex;
  gap: 0.5rem;
`

const MetaRight = styled.div`
  display: flex;
  gap: 1rem;
`

const IconText = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export default function CommunityPage() {
  const router = useRouter()
  const { posts, selectedRegion, setSelectedRegion } = usePosts()
  const { data: session } = useSession()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All', '일반', '질문', '정보', '잡담'])

  // Fetch User Region to set default
  useEffect(() => {
    if (session?.user?.region) {
      // Only set if current is All (initial load)
      if (selectedRegion === 'All') {
        setSelectedRegion(session.user.region)
      }
    }
  }, [session, selectedRegion, setSelectedRegion])

  useEffect(() => {
    fetch('/api/posts/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const unique = Array.from(new Set(['All', ...data]))
          setCategories(unique)
        }
      })
      .catch(console.error)
  }, [])

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(post => post.category === selectedCategory)

  return (
    <Container>
      <Header>
        <Title>자유게시판</Title>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '0.9rem'
            }}
          >
            <option value="All">전체 (All Regions)</option>
            {/* Global? Or just treat All as Global + Regions? */}
            {/* Wait, user said "Canada Board" is global. */}
            {/* Maybe we need a specific 'Global' option explicitly? */}
            <option value="Global">캐나다 전체 (Global)</option>
            <option value="Toronto">토론토</option>
            <option value="Vancouver">밴쿠버</option>
            <option value="Montreal">몬트리올</option>
            <option value="Quebec">퀘벡</option>
            <option value="Calgary">캘거리</option>
            <option value="Ottawa">오타와</option>
            <option value="Edmonton">에드먼턴</option>
            <option value="Winnipeg">위니펙</option>
            <option value="Halifax">할리팩스</option>
            <option value="Other">그 외</option>
          </select>
          <WriteButton onClick={() => router.push('/community/write')}>
            <Plus size={18} />
            글쓰기
          </WriteButton>
        </div>
      </Header>

      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: selectedCategory === cat ? '#3b82f6' : 'white',
              color: selectedCategory === cat ? 'white' : '#4b5563',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.9rem',
              fontWeight: 600,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <PostList>
        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '3rem' }}>
            {selectedCategory === 'All' ? '첫 번째 글을 작성해보세요!' : '해당 카테고리에 글이 없습니다.'}
          </div>
        ) : (
          filteredPosts.map(post => (
            post.category === '모임' && post.meetup ? (
              <MeetupCard key={post.id} post={post} />
            ) : (
              <PostCard key={post.id} onClick={() => router.push(`/community/${post.id}`)}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#3b82f6',
                    backgroundColor: '#eff6ff',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: 600
                  }}>
                    {post.category || '일반'}
                  </span>
                </div>
                <PostTitle>{post.title}</PostTitle>
                <PostPreview>{post.content}</PostPreview>
                <MetaRow>
                  <MetaLeft>
                    <span>{post.user?.name || '익명'}</span>
                    <span>·</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </MetaLeft>
                  <MetaRight>
                    <IconText><ThumbsUp size={14} /> {post._count?.likes || 0}</IconText>
                    <IconText><MessageCircle size={14} /> {post._count?.comments || 0}</IconText>
                  </MetaRight>
                </MetaRow>
              </PostCard>
            )
          ))
        )}
      </PostList>
    </Container>
  )
}
