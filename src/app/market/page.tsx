'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { useMarket } from '@/contexts/MarketContext'
import { Plus, Heart, Map as MapIcon, Grid } from 'lucide-react'
import PropertyMap from '@/components/real-estate/PropertyMap'
import PropertyCard from '@/components/real-estate/PropertyCard'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding-bottom: 80px; /* Space for BottomNav */
  overflow: hidden;
`

const Header = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background.primary};
  z-index: 20;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 0;
  flex: 1;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text.secondary)};
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;
`

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`

const ScrollableGrid = styled.div`
  overflow-y: auto;
  padding: 1rem;
  padding-bottom: 20px;
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`

// --- Real Estate Styles ---
const MapSection = styled.div`
  flex: 0 0 40vh; /* Top 40% */
  position: relative;
`

const ListSection = styled.div`
  flex: 1;
  overflow-y: auto;
  background: white;
  padding-bottom: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-top: -16px; /* Overlap map slightly */
  z-index: 10;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.05);
`

// --- Product Components ---
const ProductCardWrapper = styled.div`
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
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'REAL_ESTATE'>('PRODUCTS')

  // Real Estate State
  const [properties, setProperties] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loadingProperties, setLoadingProperties] = useState(false)

  useEffect(() => {
    if (activeTab === 'REAL_ESTATE' && properties.length === 0) {
      fetchProperties()
    }
  }, [activeTab])

  const fetchProperties = async () => {
    setLoadingProperties(true)
    try {
      const res = await fetch('/api/properties')
      if (res.ok) {
        const data = await res.json()
        setProperties(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingProperties(false)
    }
  }

  const handleWrite = () => {
    if (activeTab === 'PRODUCTS') {
      router.push('/market/sell')
    } else {
      router.push('/real-estate/create')
    }
  }

  const handlePropertySelect = (id: string) => {
    setSelectedId(id)
    const el = document.getElementById(`property-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <Container>
      <Header>
        <TopRow>
          <Title>장터</Title>
          <WriteButton onClick={handleWrite}>
            <Plus size={18} />
            {activeTab === 'PRODUCTS' ? '물건 팔기' : '매물 등록'}
          </WriteButton>
        </TopRow>
        <TabContainer>
          <Tab $active={activeTab === 'PRODUCTS'} onClick={() => setActiveTab('PRODUCTS')}>
            중고거래
          </Tab>
          <Tab $active={activeTab === 'REAL_ESTATE'} onClick={() => setActiveTab('REAL_ESTATE')}>
            부동산
          </Tab>
        </TabContainer>
      </Header>

      <ContentArea>
        {activeTab === 'PRODUCTS' ? (
          <ScrollableGrid>
            <ProductGrid>
              {products.map(product => (
                <ProductCardWrapper key={product.id} onClick={() => router.push(`/market/${product.id}`)}>
                  <ImageWrapper>
                    <ProductImage src={product.imageUrl || 'https://placehold.co/400/png?text=No+Image'} alt={product.title} />
                    {product.status !== 'SELLING' && (
                      <StatusBadge>{product.status === 'RESERVED' ? '예약중' : '판매완료'}</StatusBadge>
                    )}
                  </ImageWrapper>
                  <CardContent>
                    <ProductTitle>{product.title}</ProductTitle>
                    <Price>${product.price.toLocaleString()}</Price>
                    <Meta>
                      <span>{product.category}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Heart size={10} fill={product._count?.likes > 0 ? 'currentColor' : 'none'} /> {product._count?.likes || 0}
                      </span>
                    </Meta>
                  </CardContent>
                </ProductCardWrapper>
              ))}
            </ProductGrid>
          </ScrollableGrid>
        ) : (
          <>
            <MapSection>
              <PropertyMap
                properties={properties}
                selectedId={selectedId}
                onSelect={handlePropertySelect}
              />
            </MapSection>

            <ListSection>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>
                {properties.length} Homes
              </div>
              {loadingProperties ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
              ) : (
                properties.map(property => (
                  <div key={property.id} id={`property-${property.id}`}>
                    <PropertyCard
                      property={property}
                      selected={selectedId === property.id}
                      onClick={() => router.push(`/real-estate/${property.id}`)}
                    />
                  </div>
                ))
              )}
            </ListSection>
          </>
        )}
      </ContentArea>
    </Container>
  )
}
