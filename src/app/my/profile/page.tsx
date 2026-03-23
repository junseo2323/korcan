'use client'

import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { ChevronLeft, User, MapPin, Calendar, FileText, MessageSquare, Heart, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  background: #f4f6fa;
  min-height: 100vh;
  padding-bottom: 80px;
`

const Header = styled.div`
  position: sticky;
  top: 60px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.875rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 10;
`

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #1a1f2e;
  padding: 0;
`

const HeaderTitle = styled.h1`
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
`

const ProfileCard = styled.div`
  background: white;
  padding: 1.5rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`

const AvatarWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e5e7eb;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ProfileName = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1f2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ProfileMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.4rem;
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #6b7280;
`

const StatsRow = styled.div`
  background: white;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 0.5rem;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.5rem;
  gap: 0.25rem;
  border-right: 1px solid #f3f4f6;
  &:last-child { border-right: none; }
`

const StatNum = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  color: #1a1f2e;
`

const StatLabel = styled.div`
  font-size: 0.72rem;
  color: #6b7280;
  font-weight: 500;
`

const TabBar = styled.div`
  background: white;
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: calc(60px + 49px);
  z-index: 9;
  margin-bottom: 0.5rem;
`

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.875rem 0;
  border: none;
  background: none;
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  color: ${({ $active }) => ($active ? '#3B82F6' : '#6b7280')};
  border-bottom: 2px solid ${({ $active }) => ($active ? '#3B82F6' : 'transparent')};
  cursor: pointer;
  transition: all 0.15s;
`

const ListWrap = styled.div`
  background: white;
  border-radius: 12px;
  margin: 0 0.75rem 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`

const PostItem = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  text-decoration: none;
  color: inherit;
  &:last-child { border-bottom: none; }
  &:hover { background: #f9fafb; }
`

const PostTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1f2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
`

const CategoryBadge = styled.span`
  background: #eff6ff;
  color: #3B82F6;
  padding: 1px 7px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
`

const CommentItem = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  text-decoration: none;
  color: inherit;
  &:last-child { border-bottom: none; }
  &:hover { background: #f9fafb; }
`

const CommentContent = styled.div`
  font-size: 0.875rem;
  color: #1a1f2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CommentPostTitle = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const EmptyState = styled.div`
  padding: 3rem 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
`

const PageBtn = styled.button<{ $active?: boolean }>`
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: ${({ $active }) => ($active ? '#3B82F6' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#374151')};
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
`

const DangerZone = styled.div`
  margin: 1.5rem 0.75rem 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`

const DangerTitle = styled.div`
  padding: 0.875rem 1rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f3f4f6;
`

const DangerBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #ef4444;
  font-weight: 500;
  &:hover { background: #fef2f2; }
`

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'posts' | 'comments' | 'likes'

interface ProfileData {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    region: string | null
    createdAt: string
  }
  stats: { posts: number; comments: number; likes: number }
  items: any[]
  total: number
  pages: number
  page: number
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('posts')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback((tab: Tab, p: number) => {
    setLoading(true)
    fetch(`/api/my/profile?tab=${tab}&page=${p}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load(activeTab, page)
  }, [load, activeTab, page])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setPage(1)
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      '정말로 탈퇴하시겠습니까?\n\n모든 게시글, 댓글, 데이터가 영구 삭제되며 복구할 수 없습니다.'
    )
    if (!confirmed) return

    const res = await fetch('/api/my/account', { method: 'DELETE' })
    if (res.ok) {
      await signOut({ redirect: false })
      router.push('/')
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  const formatShort = (iso: string) =>
    new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })

  const user = data?.user
  const stats = data?.stats

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </BackButton>
        <HeaderTitle>내 프로필</HeaderTitle>
      </Header>

      {/* Profile Card */}
      <ProfileCard>
        <AvatarWrap>
          {user?.image
            ? <AvatarImg src={user.image} alt="프로필" />
            : <User size={28} color="#9ca3af" />
          }
        </AvatarWrap>
        <ProfileInfo>
          <ProfileName>{user?.name || '이름 없음'}</ProfileName>
          <ProfileMeta>
            {user?.email && (
              <MetaRow>
                <span>{user.email}</span>
              </MetaRow>
            )}
            {user?.region && (
              <MetaRow>
                <MapPin size={12} />
                <span>{user.region}</span>
              </MetaRow>
            )}
            {user?.createdAt && (
              <MetaRow>
                <Calendar size={12} />
                <span>{formatDate(user.createdAt)} 가입</span>
              </MetaRow>
            )}
          </ProfileMeta>
        </ProfileInfo>
      </ProfileCard>

      {/* Stats */}
      <StatsRow>
        <StatItem onClick={() => handleTabChange('posts')} style={{ cursor: 'pointer' }}>
          <StatNum>{stats?.posts ?? '-'}</StatNum>
          <StatLabel>작성한 글</StatLabel>
        </StatItem>
        <StatItem onClick={() => handleTabChange('comments')} style={{ cursor: 'pointer' }}>
          <StatNum>{stats?.comments ?? '-'}</StatNum>
          <StatLabel>댓글</StatLabel>
        </StatItem>
        <StatItem onClick={() => handleTabChange('likes')} style={{ cursor: 'pointer' }}>
          <StatNum>{stats?.likes ?? '-'}</StatNum>
          <StatLabel>좋아요</StatLabel>
        </StatItem>
      </StatsRow>

      {/* Tabs */}
      <TabBar>
        <Tab $active={activeTab === 'posts'} onClick={() => handleTabChange('posts')}>
          내 글
        </Tab>
        <Tab $active={activeTab === 'comments'} onClick={() => handleTabChange('comments')}>
          댓글
        </Tab>
        <Tab $active={activeTab === 'likes'} onClick={() => handleTabChange('likes')}>
          좋아요
        </Tab>
      </TabBar>

      {/* List */}
      {loading ? (
        <EmptyState>불러오는 중...</EmptyState>
      ) : !data?.items.length ? (
        <EmptyState>
          {activeTab === 'posts' && '작성한 글이 없습니다.'}
          {activeTab === 'comments' && '작성한 댓글이 없습니다.'}
          {activeTab === 'likes' && '좋아요한 글이 없습니다.'}
        </EmptyState>
      ) : (
        <ListWrap>
          {activeTab === 'posts' && data.items.map((post: any) => (
            <PostItem key={post.id} href={`/community/${post.id}`}>
              <PostTitle>{post.title}</PostTitle>
              <PostMeta>
                <CategoryBadge>{post.category}</CategoryBadge>
                <span>{formatShort(post.createdAt)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <MessageSquare size={11} /> {post._count.comments}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Heart size={11} /> {post._count.likes}
                </span>
              </PostMeta>
            </PostItem>
          ))}

          {activeTab === 'comments' && data.items.map((comment: any) => (
            <CommentItem key={comment.id} href={`/community/${comment.post?.id}`}>
              <CommentContent>{comment.content}</CommentContent>
              <CommentPostTitle>
                <FileText size={11} />
                {comment.post?.title || '삭제된 게시글'}
                <span style={{ marginLeft: 'auto' }}>{formatShort(comment.createdAt)}</span>
              </CommentPostTitle>
            </CommentItem>
          ))}

          {activeTab === 'likes' && data.items.map((like: any) => (
            <PostItem key={like.id} href={`/community/${like.post?.id}`}>
              <PostTitle>{like.post?.title || '삭제된 게시글'}</PostTitle>
              <PostMeta>
                {like.post?.category && <CategoryBadge>{like.post.category}</CategoryBadge>}
                {like.post?.createdAt && <span>{formatShort(like.post.createdAt)}</span>}
              </PostMeta>
            </PostItem>
          ))}
        </ListWrap>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <Pagination>
          {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
            <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>{p}</PageBtn>
          ))}
        </Pagination>
      )}

      {/* Danger Zone */}
      <DangerZone>
        <DangerTitle>계정 관리</DangerTitle>
        <DangerBtn onClick={handleDeleteAccount}>
          <span>회원 탈퇴</span>
          <ChevronRight size={16} />
        </DangerBtn>
      </DangerZone>
    </Container>
  )
}
