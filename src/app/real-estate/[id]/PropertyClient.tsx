'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ChevronLeft, Share2, Heart, MapPin, Bed, Bath, User } from 'lucide-react'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { toast } from 'sonner'
// import { format } from 'date-fns' // If needed

const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  padding-bottom: 100px;
`

const ImageCarousel = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  height: 300px;
  background-color: #f3f4f6;

  &::-webkit-scrollbar {
    display: none;
  }
`

const CarouselSlide = styled.div`
  flex: 0 0 100%;
  position: relative;
  height: 100%;
  scroll-snap-align: center;
`

const CarouselImage = styled(Image)`
  object-fit: cover;
`

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent);
`

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);

  &:active {
    transform: scale(0.95);
  }
`

const Content = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const TitleSection = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  padding-bottom: 1.5rem;
`

const TypeBadge = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
`

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`

const InfoRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: pre-wrap;
`

const FeatureList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const FeatureTag = styled.span`
  background-color: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const MapWrapper = styled.div`
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`

const SellerSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 12px;
`

const Avatar = styled.div<{ $url?: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e5e7eb;
  background-image: ${({ $url }) => $url ? `url(${$url})` : 'none'};
  background-size: cover;
  background-position: center;
`

const SellerInfo = styled.div`
  flex: 1;
`

const SellerName = styled.div`
  font-weight: 600;
`

const ContactButton = styled.button`
  position: fixed;
  bottom: 90px;
  left: 24px;
  right: 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 16px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  z-index: 100;

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`

export default function PropertyClient() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string)
    }
  }, [params.id])

  const fetchProperty = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProperty(data)
      } else {
        toast.error("매물을 불러오는데 실패했습니다.")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleContact = () => {
    if (!session) {
      toast.error("로그인이 필요합니다.")
      router.push('/login')
      return
    }
    toast.info("채팅 기능 연결 중...")
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (!property) return <div style={{ padding: '2rem' }}>매물을 찾을 수 없습니다.</div>

  const features = property.features ? (Array.isArray(property.features) ? property.features : property.features.split(',')) : []

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <Container>
        <div style={{ position: 'relative' }}>
          <Header>
            <IconButton onClick={() => router.back()}>
              <ChevronLeft size={24} />
            </IconButton>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <IconButton>
                <Share2 size={20} />
              </IconButton>
              <IconButton>
                <Heart size={20} />
              </IconButton>
            </div>
          </Header>

          <ImageCarousel>
            {property.images && property.images.length > 0 ? (
              property.images.map((img: any) => (
                <CarouselSlide key={img.id}>
                  <CarouselImage src={img.url} alt={property.title} fill sizes="100vw" />
                </CarouselSlide>
              ))
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                이미지가 없습니다.
              </div>
            )}
          </ImageCarousel>
        </div>

        <Content>
          <TitleSection>
            <TypeBadge>{property.type} · {property.period}</TypeBadge>
            <Title>{property.title}</Title>
            <Price>
              {property.currency === 'CAD' ? '$' : '₩'}
              {property.price.toLocaleString()}
              <span style={{ fontSize: '1rem', fontWeight: 400, color: '#6b7280' }}> / month</span>
            </Price>
            <InfoRow>
              <InfoItem><Bed size={18} /> {property.bedrooms} Bed</InfoItem>
              <InfoItem><Bath size={18} /> {property.bathrooms} Bath</InfoItem>
            </InfoRow>
          </TitleSection>

          <div>
            <SectionTitle>상세 설명</SectionTitle>
            <Description>{property.description}</Description>
          </div>

          {features.length > 0 && (
            <div>
              <SectionTitle>특징 & 옵션</SectionTitle>
              <FeatureList>
                {features.map((feat: string, idx: number) => (
                  <FeatureTag key={idx}>{feat.trim()}</FeatureTag>
                ))}
              </FeatureList>
            </div>
          )}

          <div>
            <SectionTitle>위치</SectionTitle>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#4b5563', display: 'flex', gap: '4px' }}>
              <MapPin size={16} /> {property.address}
            </div>
            <MapWrapper>
              <Map
                defaultCenter={{ lat: property.latitude, lng: property.longitude }}
                defaultZoom={15}
                mapId="DETAIL_MAP"
                disableDefaultUI={true}
                gestureHandling={'cooperative'}
              >
                <AdvancedMarker position={{ lat: property.latitude, lng: property.longitude }} />
              </Map>
            </MapWrapper>
          </div>

          <div>
            <SectionTitle>호스트</SectionTitle>
            <SellerSection>
              <Avatar $url={property.user?.image} />
              <SellerInfo>
                <SellerName>{property.user?.name || '알 수 없는 사용자'}</SellerName>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>응답률 높음</div>
              </SellerInfo>
            </SellerSection>
          </div>
        </Content>

        <ContactButton onClick={handleContact}>
          {property.user?.name}님에게 연락하기
        </ContactButton>
      </Container>
    </APIProvider>
  )
}
