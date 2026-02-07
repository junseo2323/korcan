'use client'

import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { useMarket } from '@/contexts/MarketContext'
import { Plus, Heart } from 'lucide-react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`

const ProductCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  display: flex;
  flex-direction: column;
`

const ImageWrapper = styled.div`
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.neutral.gray100};
  position: relative;
`

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const StatusBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
`

const CardContent = styled.div`
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const ProductTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.4em;
`

const Price = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Meta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`

export default function MarketPage() {
  const router = useRouter()
  const { products } = useMarket()

  return (
    <Container>
      <Header>
        <Title>중고장터</Title>
        <WriteButton onClick={() => router.push('/market/sell')}>
          <Plus size={18} />
          판매하기
        </WriteButton>
      </Header>

      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product.id} onClick={() => router.push(`/market/${product.id}`)}>
            <ImageWrapper>
              <ProductImage src={product.imageUrl} alt={product.title} />
              {product.status !== 'selling' && (
                <StatusBadge>{product.status === 'reserved' ? '예약중' : '판매완료'}</StatusBadge>
              )}
            </ImageWrapper>
            <CardContent>
              <ProductTitle>{product.title}</ProductTitle>
              <Price>${product.price}</Price>
              <Meta>
                <span>{product.category}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Heart size={10} fill={product.likes > 0 ? 'currentColor' : 'none'} /> {product.likes}
                </span>
              </Meta>
            </CardContent>
          </ProductCard>
        ))}
      </ProductGrid>
    </Container>
  )
}
