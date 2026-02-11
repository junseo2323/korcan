'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ChevronLeft, Share, MoreHorizontal, Heart, Trash2, CheckCircle } from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import Toast from '@/components/ui/Toast'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 90px;
  background-color: white;
  min-height: 100vh;
`

const ImageArea = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.neutral.gray100};
  position: relative;
`

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent); */
`

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: black;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`

const StatusBadge = styled.div<{ $status: string }>`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: ${({ $status }) => $status === 'SELLING' ? '#3b82f6' : $status === 'RESERVED' ? '#f59e0b' : '#374151'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`

const ContentArea = styled.div`
  padding: 1.5rem;
  flex: 1;
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.gray100};
  margin-bottom: 1.5rem;
`

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.neutral.gray200};
  overflow: hidden;
`

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const UserName = styled.span`
  font-weight: 700;
  font-size: 1rem;
`

const UserLocation = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const ProductTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

const CategoryDate = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: pre-wrap;
`

const BottomBar = styled.div`
  position: fixed;
  bottom: calc(60px + env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
`

const LeftActions = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`

const HeartButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: ${({ theme, $active }) => $active ? theme.colors.status.error : theme.colors.text.secondary};
  font-size: 0.8rem;
  padding-right: 1rem;
  border-right: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  cursor: pointer;
`

const PriceArea = styled.div`
  /* padding-left: 1rem; */
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 800;
`

const ChatButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  
  &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
  }
`

const SellerControls = styled.div`
    display: flex;
    gap: 0.5rem;
`

const SmallButton = styled.button<{ $variant?: 'danger' | 'outline' }>`
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    border-radius: 8px;
    border: 1px solid ${({ theme, $variant }) => $variant === 'danger' ? '#ef4444' : theme.colors.neutral.gray300};
    color: ${({ theme, $variant }) => $variant === 'danger' ? '#ef4444' : theme.colors.text.primary};
    background: none;
    cursor: pointer;
    font-weight: 600;
`

import { useChat } from '@/contexts/ChatContext'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { openChatWithUser } = useChat()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSeller, setIsSeller] = useState(false)

  // UI State
  const [deleteModal, setDeleteModal] = useState(false)
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })

  const showToast = (message: string) => setToast({ show: true, message })

  useEffect(() => {
    if (params.id) {
      fetch(`/api/products/${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error)
          setProduct(data)
          if (session?.user?.id && data.sellerId === session.user.id) {
            setIsSeller(true)
          }
        })
        .catch(e => console.error(e))
        .finally(() => setLoading(false))
    }
  }, [params.id, session?.user?.id])

  const handleLike = async () => {
    if (!product || !session) return showToast('로그인이 필요합니다.')

    // Optimistic
    const wasLiked = product.isLiked
    setProduct((prev: any) => ({
      ...prev,
      isLiked: !wasLiked,
      _count: { likes: prev._count.likes + (wasLiked ? -1 : 1) }
    }))

    try {
      await fetch(`/api/products/${product.id}/like`, { method: 'POST' })
    } catch (e) {
      // Rollback
      setProduct((prev: any) => ({
        ...prev,
        isLiked: wasLiked,
        _count: { likes: prev._count.likes + (wasLiked ? 1 : -1) }
      }))
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/market')
      } else {
        showToast('삭제 실패')
      }
    } catch (e) { showToast('오류 발생') }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    // Optimistic
    const oldStatus = product.status
    setProduct((prev: any) => ({ ...prev, status: newStatus }))

    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      showToast('상태가 변경되었습니다.')
    } catch (e) {
      setProduct((prev: any) => ({ ...prev, status: oldStatus }))
      showToast('변경 실패')
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (!product) return <div style={{ padding: '2rem' }}>Product not found</div>

  return (
    <Container>
      <ImageArea>
        <ProductImage src={product.imageUrl || 'https://placehold.co/400/png?text=No+Image'} />
        <StatusBadge $status={product.status}>
          {product.status === 'SELLING' ? '판매중' : product.status === 'RESERVED' ? '예약중' : '판매완료'}
        </StatusBadge>
        <HeaderOverlay>
          <IconButton onClick={() => router.back()}>
            <ChevronLeft size={24} />
          </IconButton>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <IconButton><Share size={20} /></IconButton>
          </div>
        </HeaderOverlay>
      </ImageArea>

      <ContentArea>
        <UserProfile>
          <Avatar>
            {product.seller.image && <AvatarImg src={product.seller.image} />}
          </Avatar>
          <UserInfo>
            <UserName>{product.seller.name || '알 수 없음'}</UserName>
            <UserLocation>밴쿠버</UserLocation>
          </UserInfo>
          {isSeller && (
            <div style={{ marginLeft: 'auto' }}>
              <SmallButton $variant="danger" onClick={() => setDeleteModal(true)}>
                <Trash2 size={16} />
              </SmallButton>
            </div>
          )}
        </UserProfile>

        <ProductTitle>{product.title}</ProductTitle>
        <CategoryDate>{product.category} · {new Date(product.createdAt).toLocaleDateString()}</CategoryDate>
        <Description>{product.description}</Description>
      </ContentArea>

      <BottomBar>
        <LeftActions>
          <HeartButton onClick={handleLike} $active={product.isLiked}>
            <Heart size={24} fill={product.isLiked ? 'currentColor' : 'none'} />
            <span>{product._count.likes}</span>
          </HeartButton>
          <PriceArea>${product.price.toLocaleString()}</PriceArea>
        </LeftActions>

        {isSeller ? (
          <SellerControls>
            {product.status === 'SELLING' && (
              <SmallButton onClick={() => handleStatusUpdate('RESERVED')}>예약중 처리</SmallButton>
            )}
            {product.status !== 'SOLD' && (
              <SmallButton onClick={() => handleStatusUpdate('SOLD')}>판매완료 처리</SmallButton>
            )}
            {product.status === 'SOLD' && (
              <SmallButton onClick={() => handleStatusUpdate('SELLING')}>다시 판매하기</SmallButton>
            )}
          </SellerControls>
        ) : (
          <ChatButton
            disabled={product.status !== 'SELLING'}
            onClick={() => openChatWithUser(product.sellerId)}
          >
            {product.status === 'SELLING' ? '채팅하기' : '거래 종료'}
          </ChatButton>
        )}
      </BottomBar>

      <ConfirmModal
        isOpen={deleteModal}
        title="상품 삭제"
        message="정말로 이 상품을 삭제하시겠습니까?"
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {toast.show && <Toast message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
    </Container>
  )
}
