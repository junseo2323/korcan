'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { usePosts } from '@/contexts/PostContext'
import { ChevronLeft, ThumbsUp, MessageCircle, Send } from 'lucide-react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 120px; /* Increased to account for input box + bottom nav */
  min-height: 100vh;
  background-color: white;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-right: 1rem;
`

const ContentArea = styled.div`
  padding: 1.5rem;
`

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.4;
`

const MetaInfo = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.disabled};
  margin-bottom: 2rem;
`

const BodyText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: pre-wrap;
  margin-bottom: 3rem;
`

const ActionRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
`

const CommentsSection = styled.div`
  border-top: 8px solid ${({ theme }) => theme.colors.background.secondary};
  padding: 1.5rem;
`

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const CommentAuthor = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`

const CommentText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const CommentDate = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.disabled};
`

const CommentInputBox = styled.div`
  position: fixed;
  bottom: calc(60px + env(safe-area-inset-bottom)); /* Sit above BottomNavigation */
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  gap: 0.5rem;
  align-items: center;
  z-index: 900; /* Below Nav (1000) but above content */
  /* Remove extra padding-bottom since it's above the safe area now */
`

const Input = styled.input`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: none;
  border-radius: 20px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  outline: none;
`

const SendButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`

import ConfirmModal from '@/components/ui/ConfirmModal'
import Toast from '@/components/ui/Toast'
import { useSession } from 'next-auth/react'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { updatePost } = usePosts()

  const [post, setPost] = useState<any>(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)

  // UI State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, commentId: string | null }>({ isOpen: false, commentId: null })
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })

  const showToast = (message: string) => {
    setToast({ show: true, message })
  }

  const fetchPostDetail = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setPost(data)
      } else {
        // Post not found ?
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (params.id) fetchPostDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleLike = async () => {
    if (!post) return
    // Optimistic
    const wasLiked = post.isLiked
    setPost((prev: any) => {
      const newLikes = prev._count.likes + (wasLiked ? -1 : 1)
      const updated = {
        ...prev,
        isLiked: !wasLiked,
        _count: { ...prev._count, likes: newLikes }
      }
      // Sync global context
      updatePost(post.id, { _count: { ...post._count, likes: newLikes } })
      return updated
    })

    try {
      await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
      // Background re-verify optional
    } catch (e) {
      console.error(e)
      // Rollback
      setPost((prev: any) => ({
        ...prev,
        isLiked: wasLiked,
        _count: {
          ...prev._count,
          likes: prev._count.likes + (wasLiked ? 1 : -1)
        }
      }))
    }
  }

  const handleSendComment = async () => {
    if (!comment.trim()) return

    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment })
      })

      if (res.ok) {
        setComment('')
        fetchPostDetail() // Reload to see new comment

        // Sync global context (increment comment count)
        if (post) {
          updatePost(post.id, {
            _count: {
              ...post._count,
              comments: (post._count?.comments || 0) + 1
            }
          })
        }
      }
    } catch (e) { console.error(e) }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (!post) return <div style={{ padding: '2rem' }}>Post not found</div>

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </BackButton>
      </Header>

      <ContentArea>
        <Title>{post.title}</Title>
        <MetaInfo>
          <span>{post.user?.name || '익명'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>조회 {post.views}</span>
        </MetaInfo>
        <BodyText>{post.content}</BodyText>

        <ActionRow>
          <ActionButton onClick={handleLike} style={{ color: post.isLiked ? '#3b82f6' : 'inherit' }}>
            <ThumbsUp size={16} fill={post.isLiked ? 'currentColor' : 'none'} /> {post._count?.likes || 0}
          </ActionButton>
          <ActionButton>
            <MessageCircle size={16} /> {post._count?.comments || 0}
          </ActionButton>
        </ActionRow>
      </ContentArea>

      <CommentsSection>
        <CommentList>
          {post.comments?.map((comment: any) =>
            <div key={comment.id} style={{
              padding: '1rem',
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{comment.user?.name || comment.authorName || '익명'}</span>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.5 }}>{comment.content}</p>
              </div>
              {session?.user?.id === comment.userId && (
                <button
                  onClick={() => setDeleteModal({ isOpen: true, commentId: comment.id })}
                  style={{
                    fontSize: '0.8rem',
                    color: '#ef4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          )}
        </CommentList>
      </CommentsSection>

      <div style={{ height: '60px' }} />

      <CommentInputBox>
        <Input
          placeholder={session ? "댓글을 남겨보세요." : "로그인이 필요합니다."}
          value={comment}
          onChange={e => setComment(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendComment()}
          disabled={!session}
        />
        <SendButton onClick={handleSendComment} disabled={!session} style={{ opacity: session ? 1 : 0.5 }}>
          <Send size={24} />
        </SendButton>
      </CommentInputBox>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="댓글 삭제"
        message="정말로 이 댓글을 삭제하시겠습니까?"
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={async () => {
          if (!deleteModal.commentId) return
          try {
            await fetch(`/api/comments/${deleteModal.commentId}`, { method: 'DELETE' })
            setPost((prev: any) => {
              const newComments = prev._count.comments - 1
              const updated = {
                ...prev,
                comments: prev.comments.filter((c: any) => c.id !== deleteModal.commentId),
                _count: { ...prev._count, comments: newComments }
              }
              updatePost(post.id, {
                _count: { ...post._count, comments: newComments }
              })
              return updated
            })
            showToast('댓글이 삭제되었습니다.')
          } catch (e) {
            showToast('댓글 삭제 실패')
          } finally {
            setDeleteModal({ isOpen: false, commentId: null })
          }
        }}
      />

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

    </Container>
  )
}
