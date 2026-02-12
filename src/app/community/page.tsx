'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { usePosts } from '@/contexts/PostContext'
import { useSession } from 'next-auth/react'
import { Plus, MessageCircle, ThumbsUp, ChevronDown } from 'lucide-react'
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
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
`

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 120%;
  right: 0;
  min-width: 180px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 0.5rem;
  z-index: 50;
  display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
  border: 1px solid #f3f4f6;
  max-height: 400px;
  overflow-y: auto;
`

const DropdownItem = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: ${({ $isSelected }) => $isSelected ? '#eff6ff' : 'white'};
  color: ${({ $isSelected }) => $isSelected ? '#3b82f6' : '#374151'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: ${({ $isSelected }) => $isSelected ? 600 : 400};
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $isSelected }) => $isSelected ? '#eff6ff' : '#f9fafb'};
  }
`

const FloatingWriteButton = styled.button`
  position: fixed;
  bottom: calc(80px + 24px); /* Bottom Nav height (approx 60-80px) + margin */
  right: 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
  z-index: 100;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const TabButton = styled.button<{ $isActive: boolean }>`
  border: none;
  background: none;
  font-size: 1.1rem;
  font-weight: ${({ $isActive }) => $isActive ? 700 : 500};
  color: ${({ $isActive }) => $isActive ? '#111827' : '#9ca3af'};
  cursor: pointer;
  padding: 0.5rem 0.2rem;
  border-bottom: ${({ $isActive }) => $isActive ? '2px solid #111827' : '2px solid transparent'};
  transition: all 0.2s;
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
  const [activeTab, setActiveTab] = useState<'board' | 'meetup'>('board')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Board categories (excluding '모임')
  const boardCategories = ['All', '일반', '질문', '정보', '잡담']

  const regions = [
    { id: 'All', label: '전체 (All Regions)' },
    { id: 'Global', label: '캐나다 전체 (Global)' },
    { id: 'Toronto', label: '토론토' },
    { id: 'Vancouver', label: '밴쿠버' },
    { id: 'Montreal', label: '몬트리올' },
    { id: 'Quebec', label: '퀘벡' },
    { id: 'Calgary', label: '캘거리' },
    { id: 'Ottawa', label: '오타와' },
    { id: 'Edmonton', label: '에드먼턴' },
    { id: 'Winnipeg', label: '위니펙' },
    { id: 'Halifax', label: '할리팩스' },
    { id: 'Other', label: '그 외' },
  ]

  // Fetch User Region to set default
  useEffect(() => {
    if (session?.user?.region) {
      if (selectedRegion === 'All') {
        setSelectedRegion(session.user.region)
      }
    }
  }, [session, selectedRegion, setSelectedRegion])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#region-dropdown')) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter posts based on active tab
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'meetup') {
      return post.category === '모임'
    } else {
      // Board view: Exclude '모임'
      if (post.category === '모임') return false
      // Apply category filter
      if (selectedCategory !== 'All' && post.category !== selectedCategory) return false
      return true
    }
  })

  // Currently selected region label
  const currentRegionLabel = regions.find(r => r.id === selectedRegion)?.label || selectedRegion

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title>커뮤니티</Title>

          <DropdownContainer id="region-dropdown">
            <DropdownTrigger onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {currentRegionLabel}
              <ChevronDown size={16} />
            </DropdownTrigger>
            <DropdownMenu $isOpen={isDropdownOpen}>
              {regions.map(region => (
                <DropdownItem
                  key={region.id}
                  $isSelected={selectedRegion === region.id}
                  onClick={() => {
                    setSelectedRegion(region.id)
                    setIsDropdownOpen(false)
                  }}
                >
                  {region.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </DropdownContainer>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
          <TabButton
            $isActive={activeTab === 'board'}
            onClick={() => setActiveTab('board')}
          >
            자유게시판
          </TabButton>
          <TabButton
            $isActive={activeTab === 'meetup'}
            onClick={() => setActiveTab('meetup')}
          >
            모임
          </TabButton>
        </div>
      </Header>

      {/* Category Filter - Only show in Board view */}
      {activeTab === 'board' && (
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
          {boardCategories.map(cat => (
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
      )}

      {/* Post List / Grid */}
      {activeTab === 'meetup' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredPosts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', marginTop: '3rem' }}>
              등록된 모임이 없습니다. 첫 모임을 만들어보세요!
            </div>
          ) : (
            filteredPosts.map(post => (
              <MeetupCard key={post.id} post={post} />
            ))
          )}
        </div>
      ) : (
        <PostList>
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '3rem' }}>
              {selectedCategory === 'All' ? '첫 번째 글을 작성해보세요!' : '해당 카테고리에 글이 없습니다.'}
            </div>
          ) : (
            filteredPosts.map(post => (
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
            ))
          )}
        </PostList>
      )}

      {/* Floating Write Button */}
      <FloatingWriteButton onClick={() => router.push(`/community/write?type=${activeTab}`)}>
        <Plus size={20} />
        {activeTab === 'meetup' ? '모임 만들기' : '글쓰기'}
      </FloatingWriteButton>
    </Container>
  )
}
