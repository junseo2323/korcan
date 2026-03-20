'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Heart } from 'lucide-react'
import PropertyCard from '@/components/real-estate/PropertyCard'

const Container = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding-bottom: 80px;
`

const Header = styled.div`
  position: sticky;
  top: 60px;
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  padding: 1rem;
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
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 0;
`

const PageTitle = styled.h1`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
`

const List = styled.div`
  background: white;
  margin-top: 0.5rem;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.95rem;
`

export default function LikesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/my/likes')
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </BackButton>
        <PageTitle>찜한 매물</PageTitle>
      </Header>

      {loading ? (
        <EmptyState>불러오는 중...</EmptyState>
      ) : properties.length === 0 ? (
        <EmptyState>
          <Heart size={40} strokeWidth={1.5} />
          찜한 매물이 없습니다.
        </EmptyState>
      ) : (
        <List>
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => router.push(`/real-estate/${property.id}`)}
            />
          ))}
        </List>
      )}
    </Container>
  )
}
