'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { useMarket } from '@/contexts/MarketContext'
import { ChevronLeft, Share, MoreHorizontal, Heart } from 'lucide-react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
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
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
`

const HeartButton = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.8rem;
  padding-right: 1rem;
  border-right: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  cursor: pointer;
`

const PriceArea = styled.div`
  padding-left: 1rem;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 800;
`

const ChatButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
`

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { getProduct, likeProduct } = useMarket()
    const [product, setProduct] = useState(getProduct(params.id as string))

    useEffect(() => {
        setProduct(getProduct(params.id as string))
    }, [params.id, getProduct])

    if (!product) return <div>Loading...</div>

    const handleLike = () => {
        likeProduct(product.id)
        setProduct(prev => prev ? { ...prev, likes: prev.likes + 1 } : undefined)
    }

    return (
        <Container>
            <ImageArea>
                <ProductImage src={product.imageUrl} />
                <HeaderOverlay>
                    <IconButton onClick={() => router.back()}>
                        <ChevronLeft size={24} />
                    </IconButton>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <IconButton><Share size={20} /></IconButton>
                        <IconButton><MoreHorizontal size={20} /></IconButton>
                    </div>
                </HeaderOverlay>
            </ImageArea>

            <ContentArea>
                <UserProfile>
                    <Avatar />
                    <UserInfo>
                        <UserName>{product.seller}</UserName>
                        <UserLocation>밴쿠버 다운타운</UserLocation>
                    </UserInfo>
                </UserProfile>

                <ProductTitle>{product.title}</ProductTitle>
                <CategoryDate>{product.category} · {product.date}</CategoryDate>
                <Description>{product.description}</Description>
            </ContentArea>

            <BottomBar>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <HeartButton onClick={handleLike}>
                        <Heart size={24} fill={product.likes > 0 ? 'red' : 'none'} color={product.likes > 0 ? 'red' : 'currentColor'} />
                        <span>{product.likes}</span>
                    </HeartButton>
                    <PriceArea>${product.price}</PriceArea>
                </div>
                <ChatButton>채팅하기</ChatButton>
            </BottomBar>
        </Container>
    )
}
