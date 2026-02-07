'use client'

import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { usePosts } from '@/contexts/PostContext'
import { Plus, MessageCircle, ThumbsUp } from 'lucide-react'

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
  const { posts } = usePosts()

  return (
    <Container>
      <Header>
        <Title>자유게시판</Title>
        <WriteButton onClick={() => router.push('/community/write')}>
          <Plus size={18} />
          글쓰기
        </WriteButton>
      </Header>

      <PostList>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '3rem' }}>
            첫 번째 글을 작성해보세요!
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} onClick={() => router.push(`/community/${post.id}`)}>
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
    </Container>
  )
}
