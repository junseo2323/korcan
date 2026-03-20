
'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { usePosts } from '@/contexts/PostContext'
import { useChat } from '@/contexts/ChatContext'
import { ChevronLeft, ThumbsUp, MessageCircle, Send } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

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

export default function PostClient() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const { updatePost, deletePost } = usePosts()
    const { openChatRoom } = useChat()

    const [post, setPost] = useState<any>(null)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(true)

    // UI State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, commentId: string | null }>({ isOpen: false, commentId: null })
    const [postDeleteModal, setPostDeleteModal] = useState(false)

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
        if (params.id) {
            fetchPostDetail()
            // Increment view count once per mount
            fetch(`/api/posts/${params.id}/view`, { method: 'POST' }).catch(console.error)
        }
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
        } catch (e) {
            console.error(e)
            setPost((prev: any) => ({
                ...prev,
                isLiked: wasLiked,
                _count: {
                    ...prev._count,
                    likes: prev._count.likes + (wasLiked ? 1 : -1)
                }
            }))
            toast.error('오류가 발생했습니다.')
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

                // Sync global context
                if (post) {
                    updatePost(post.id, {
                        _count: {
                            ...post._count,
                            comments: (post._count?.comments || 0) + 1
                        }
                    })
                }
                toast.success('댓글이 등록되었습니다.')
            }
        } catch (e) {
            console.error(e)
            toast.error('댓글 등록 실패')
        }
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
                    <span>{post.category === '공지' ? '관리자' : (post.user?.name || '익명')}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>조회 {post.views}</span>
                </MetaInfo>

                {post.category === '모임' && post.meetup && (
                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        border: '1px solid #e2e8f0'
                    }}>
                        {post.meetup.image && (
                            <img
                                src={post.meetup.image}
                                alt="Meetup Thumbnail"
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            />
                        )}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>📅 모임 정보</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <span style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>날짜</span>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>
                                    {new Date(post.meetup.date).toLocaleString()}
                                </span>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>장소</span>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>{post.meetup.region}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>인원</span>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>
                                    {post.meetup.currentMembers} / {post.meetup.maxMembers}명
                                </span>
                            </div>
                            <div>
                                <span style={{
                                    fontSize: '0.9rem', fontWeight: 700,
                                    color: post.meetup.status === 'OPEN' ? '#2563eb' : '#dc2626',
                                    backgroundColor: post.meetup.status === 'OPEN' ? '#dbeafe' : '#fee2e2',
                                    padding: '2px 8px', borderRadius: '4px'
                                }}>
                                    {post.meetup.status === 'OPEN' ? '모집중' : '마감'}
                                </span>
                            </div>
                        </div>

                        {session && (
                            <button
                                onClick={async () => {
                                    if (!session) return
                                    const isJoined = post.meetup.participants.some((p: any) => p.id === session.user.id)
                                    const method = isJoined ? 'DELETE' : 'POST'

                                    try {
                                        const res = await fetch(`/api/meetups/${post.meetup.id}/join`, { method })
                                        if (res.ok) {
                                            toast.success(isJoined ? '모임에서 나갔습니다.' : '모임에 참여했습니다.')
                                            fetchPostDetail()
                                        } else {
                                            const err = await res.json()
                                            toast.error(err.error || '요청 실패')
                                        }
                                    } catch (e) {
                                        console.error(e)
                                        toast.error('오류가 발생했습니다.')
                                    }
                                }}
                                disabled={post.meetup.status === 'CLOSED' && !post.meetup.participants.some((p: any) => p.id === session?.user?.id)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: post.meetup.participants.some((p: any) => p.id === session?.user?.id) ? '#ef4444' : '#3b82f6',
                                    color: 'white',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    opacity: (post.meetup.status === 'CLOSED' && !post.meetup.participants.some((p: any) => p.id === session?.user?.id)) ? 0.5 : 1
                                }}
                            >
                                {post.meetup.participants.some((p: any) => p.id === session?.user?.id) ? '모임 나가기' : '참여하기'}
                            </button>
                        )}

                        {session && post.meetup.participants.some((p: any) => p.id === session?.user?.id) && post.meetup.chatRoom && (
                            <button
                                onClick={() => {
                                    if (post.meetup.chatRoom.id) {
                                        openChatRoom(post.meetup.chatRoom.id)
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #3b82f6',
                                    backgroundColor: 'white',
                                    color: '#3b82f6',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    marginTop: '0.5rem'
                                }}
                            >
                                <MessageCircle size={18} />
                                채팅방 입장
                            </button>
                        )}

                        {/* Participants list preview */}
                        <div style={{ marginTop: '1.5rem' }}>
                            <span style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>참여자</span>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {post.meetup.participants.map((p: any) => (
                                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'white', padding: '4px 8px', borderRadius: '100px', border: '1px solid #e2e8f0' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p.image || '/placeholder-user.svg'} alt={p.name || '참가자'} width={20} height={20} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                                        <span style={{ fontSize: '0.8rem' }}>{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {post.images && post.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
                        {post.images.map((img: any) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt="Post image"
                                style={{
                                    height: '300px',
                                    borderRadius: '12px',
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                        ))}
                    </div>
                )}

                <BodyText>{post.content}</BodyText>

                <ActionRow>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <ActionButton onClick={handleLike} style={{ color: post.isLiked ? '#3b82f6' : 'inherit' }}>
                            <ThumbsUp size={16} fill={post.isLiked ? 'currentColor' : 'none'} /> {post._count?.likes || 0}
                        </ActionButton>
                        <ActionButton>
                            <MessageCircle size={16} /> {post._count?.comments || 0}
                        </ActionButton>
                    </div>

                    {(session?.user?.id === post.userId || session?.user?.role === 'ADMIN') && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                            <ActionButton onClick={() => router.push(`/community/write?id=${post.id}&type=${post.category === '모임' ? 'meetup' : 'board'}`)}>
                                수정
                            </ActionButton>
                            <ActionButton onClick={() => setPostDeleteModal(true)}>
                                삭제
                            </ActionButton>
                        </div>
                    )}
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
                            {(session?.user?.id === comment.userId || session?.user?.role === 'ADMIN') && (
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
                    onKeyDown={e => {
                        if (e.nativeEvent.isComposing) return
                        if (e.key === 'Enter') handleSendComment()
                    }}
                    disabled={!session}
                />
                <SendButton onClick={handleSendComment} disabled={!session} style={{ opacity: session ? 1 : 0.5 }}>
                    <Send size={24} />
                </SendButton>
            </CommentInputBox>

            {/* Confirmation Modal for Comment */}
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
                        toast.success('댓글이 삭제되었습니다.')
                    } catch (e) {
                        toast.error('댓글 삭제 실패')
                    } finally {
                        setDeleteModal({ isOpen: false, commentId: null })
                    }
                }}
            />

            {/* Confirmation Modal for Post */}
            <ConfirmModal
                isOpen={postDeleteModal}
                title="게시글 삭제"
                message="정말로 이 게시글을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
                onClose={() => setPostDeleteModal(false)}
                onConfirm={async () => {
                    try {
                        await deletePost(post.id)
                        toast.success('게시글이 삭제되었습니다.')
                        router.replace('/community')
                    } catch (e) {
                        toast.error('삭제 실패')
                    } finally {
                        setPostDeleteModal(false)
                    }
                }}
            />
        </Container >
    )
}
