'use client'

import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { Home } from 'lucide-react'

const Container = styled.div`
  margin-bottom: 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
`

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ViewAll = styled.button`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: none;
  border: none;
  cursor: pointer;
`

const ScrollContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
  
  &::-webkit-scrollbar {
    display: none;
  }
`

const Card = styled.div`
  flex: 0 0 160px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  scroll-snap-align: start;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`

const ImageWrapper = styled.div`
  height: 100px;
  background-color: #f3f4f6;
  position: relative;
`

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Content = styled.div`
  padding: 10px;
`

const Type = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  text-transform: uppercase;
`

const Price = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 2px;
`

const Address = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

interface Property {
    id: string
    title: string
    price: number
    currency: string
    type: string
    imageUrl: string
}

export default function PropertyRecommendationBlock({ properties }: { properties: Property[] }) {
    const router = useRouter()

    if (!properties || properties.length === 0) return null

    return (
        <Container>
            <Header>
                <Title>새로 올라온 매물 🏠</Title>
                <ViewAll onClick={() => router.push('/market?tab=REAL_ESTATE')}>전체보기</ViewAll>
            </Header>
            <ScrollContainer>
                {properties.map(property => (
                    <Card key={property.id} onClick={() => router.push(`/real-estate/${property.id}`)}>
                        <ImageWrapper>
                            {property.imageUrl ? (
                                <PropertyImage src={property.imageUrl} alt={property.title} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                    <Home size={24} />
                                </div>
                            )}
                        </ImageWrapper>
                        <Content>
                            <Type>{property.type}</Type>
                            <Price>
                                {property.currency === 'CAD' ? '$' : '₩'}
                                {property.price.toLocaleString()}
                            </Price>
                            <Address>{property.title}</Address>
                        </Content>
                    </Card>
                ))}
            </ScrollContainer>
        </Container>
    )
}
