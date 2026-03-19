'use client'

import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, MessageCircle, ShoppingBag, Home } from 'lucide-react'

const Container = styled.div`
  padding: 1rem 1.5rem;
  padding-bottom: 80px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  min-height: 100vh;
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1.5px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.6rem 1rem;
  border: none;
  background: none;
  font-size: 0.9rem;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.text.secondary};
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;
`

const ResultCount = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`

const PostCard = styled(Link)`
  display: block;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  text-decoration: none;
  color: inherit;

  &:active { opacity: 0.8; }
`

const CardTitle = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`

const CardSub = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Badge = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  background: #eff6ff;
  color: #3b82f6;
  padding: 1px 7px;
  border-radius: 9px;
  font-weight: 600;
  margin-bottom: 0.25rem;
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`

const ProductCard = styled(Link)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  text-decoration: none;
  color: inherit;
`

const ProductImage = styled.div<{ $url: string }>`
  aspect-ratio: 1;
  background: #f3f4f6;
  background-image: url(${({ $url }) => $url});
  background-size: cover;
  background-position: center;
`

const ProductInfo = styled.div`
  padding: 0.5rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.95rem;
`

type Tab = 'all' | 'posts' | 'products' | 'properties'

interface SearchResults {
  posts: {
    id: string
    title: string
    content: string
    category: string | null
    createdAt: string
    user: { name: string | null }
    _count: { likes: number; comments: number }
  }[]
  products: {
    id: string
    title: string
    description: string
    price: number
    imageUrl: string | null
    status: string
    category: string | null
  }[]
  properties: {
    id: string
    title: string
    description: string
    price: number
    currency: string
    type: string
    address: string
    images: { url: string }[]
  }[]
}

function SearchContent({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) { setResults(null); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialQuery) fetchResults(initialQuery)
  }, [initialQuery, fetchResults])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
    fetchResults(query)
  }

  const totalCount = results
    ? results.posts.length + results.products.length + results.properties.length
    : 0

  const tabs = [
    { key: 'all' as Tab, label: `전체 ${results ? totalCount : ''}` },
    { key: 'posts' as Tab, label: `커뮤니티 ${results ? results.posts.length : ''}` },
    { key: 'products' as Tab, label: `중고거래 ${results ? results.products.length : ''}` },
    { key: 'properties' as Tab, label: `부동산 ${results ? results.properties.length : ''}` },
  ]

  const showPosts = activeTab === 'all' || activeTab === 'posts'
  const showProducts = activeTab === 'all' || activeTab === 'products'
  const showProperties = activeTab === 'all' || activeTab === 'properties'

  return (
    <Container>
      <form onSubmit={handleSearch}>
        <SearchBar>
          <Search size={18} color="#9ca3af" />
          <SearchInput
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="무엇을 찾고 계신가요?"
            autoFocus
          />
        </SearchBar>
      </form>

      {results && (
        <>
          <Tabs>
            {tabs.map(tab => (
              <Tab key={tab.key} $active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </Tab>
            ))}
          </Tabs>

          {loading && <ResultCount>검색 중...</ResultCount>}

          {!loading && totalCount === 0 && (
            <EmptyState>
              &quot;{initialQuery}&quot;에 대한 검색 결과가 없습니다.
            </EmptyState>
          )}

          {!loading && showPosts && results.posts.length > 0 && (
            <section>
              {activeTab === 'all' && (
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageCircle size={16} /> 커뮤니티
                </div>
              )}
              {results.posts.map(post => (
                <PostCard key={post.id} href={`/community/${post.id}`}>
                  {post.category && <Badge>{post.category}</Badge>}
                  <CardTitle>{post.title}</CardTitle>
                  <CardSub>{post.content.slice(0, 80)}</CardSub>
                </PostCard>
              ))}
            </section>
          )}

          {!loading && showProducts && results.products.length > 0 && (
            <section style={{ marginTop: activeTab === 'all' && results.posts.length > 0 ? '1.5rem' : '0' }}>
              {activeTab === 'all' && (
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={16} /> 중고거래
                </div>
              )}
              <ProductGrid>
                {results.products.map(product => (
                  <ProductCard key={product.id} href={`/market/${product.id}`}>
                    <ProductImage $url={product.imageUrl || 'https://placehold.co/400/png?text=No+Image'} />
                    <ProductInfo>
                      <CardTitle style={{ fontSize: '0.85rem' }}>{product.title}</CardTitle>
                      <CardSub>${product.price.toLocaleString()}</CardSub>
                    </ProductInfo>
                  </ProductCard>
                ))}
              </ProductGrid>
            </section>
          )}

          {!loading && showProperties && results.properties.length > 0 && (
            <section style={{ marginTop: activeTab === 'all' && (results.posts.length > 0 || results.products.length > 0) ? '1.5rem' : '0' }}>
              {activeTab === 'all' && (
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Home size={16} /> 부동산
                </div>
              )}
              {results.properties.map(property => (
                <PostCard key={property.id} href={`/real-estate/${property.id}`}>
                  <Badge>{property.type}</Badge>
                  <CardTitle>{property.title}</CardTitle>
                  <CardSub>{property.address}</CardSub>
                  <CardSub style={{ marginTop: '0.25rem', fontWeight: 600, color: '#111' }}>
                    {property.currency === 'CAD' ? '$' : '₩'}{property.price.toLocaleString()}
                  </CardSub>
                </PostCard>
              ))}
            </section>
          )}
        </>
      )}

      {!results && !loading && (
        <EmptyState>
          검색어를 입력하세요
        </EmptyState>
      )}
    </Container>
  )
}

export default function SearchClient({ initialQuery }: { initialQuery: string }) {
  return (
    <React.Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <SearchContent initialQuery={initialQuery} />
    </React.Suspense>
  )
}
