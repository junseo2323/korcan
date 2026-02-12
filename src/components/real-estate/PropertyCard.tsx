'use client'

import React from 'react'
import styled from 'styled-components'
import { Bed, Bath, Home } from 'lucide-react'

const Card = styled.div<{ $selected?: boolean }>`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  background-color: ${({ theme, $selected }) => $selected ? '#eff6ff' : 'white'};
  cursor: pointer;
  transition: background-color 0.2s;

  &:active {
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
  }
`

const Thumbnail = styled.div<{ $url?: string }>`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background-color: #f3f4f6;
  background-image: ${({ $url }) => $url ? `url(${$url})` : 'none'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`

const Type = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  font-weight: 600;
`

const Price = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Title = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.primary};
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const MetaRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const IconText = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

interface Property {
    id: string
    title: string
    price: number
    currency: string
    type: string
    bedrooms: number
    bathrooms: number
    images: { url: string }[]
}

interface PropertyCardProps {
    property: Property
    selected?: boolean
    onClick?: () => void
}

export default function PropertyCard({ property, selected, onClick }: PropertyCardProps) {
    const imageUrl = property.images?.[0]?.url || ''

    return (
        <Card $selected={selected} onClick={onClick}>
            <Thumbnail $url={imageUrl} />
            <Info>
                <Type>{property.type} · {property.currency}</Type>
                <Price>
                    {property.currency === 'CAD' ? '$' : '₩'}
                    {property.price.toLocaleString()}
                    <span style={{ fontSize: '0.8rem', fontWeight: 400 }}> / month</span>
                </Price>
                <Title>{property.title}</Title>
                <MetaRow>
                    <IconText><Bed size={14} /> {property.bedrooms}</IconText>
                    <IconText><Bath size={14} /> {property.bathrooms}</IconText>
                </MetaRow>
            </Info>
        </Card>
    )
}
