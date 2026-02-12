'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ChevronLeft, Check, Search, MapPin, X } from 'lucide-react'
import { APIProvider, Map, AdvancedMarker, useMapsLibrary } from '@vis.gl/react-google-maps'
import { toast } from 'sonner'
import ImageUploader from '@/components/common/ImageUploader'

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  padding-bottom: 100px;
  min-height: 100vh;
  background-color: white;
  max-width: 600px;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
`

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  width: 100%;
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  width: 100%;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Row = styled.div`
  display: flex;
  gap: 1rem;
`

const AddressSearchRow = styled.div`
  display: flex;
  gap: 0.5rem;
`

const SearchButton = styled.button`
  background-color: ${({ theme }) => theme.colors.neutral.gray800};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MapPreviewWrapper = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`

const FixedButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  z-index: 100;
  max-width: 600px;
  margin: 0 auto;
`

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral.gray300};
    cursor: not-allowed;
  }
`

const TagInput = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  padding: 0.5rem;
  min-height: 48px;
`

const TagChip = styled.span`
  background-color: #eff6ff;
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`

// --- Geocoding Component ---

function GeocodingHandler({ address, onGeocode }: { address: string, onGeocode: (lat: number, lng: number, formattedAddress: string) => void }) {
    const geocodingLib = useMapsLibrary('geocoding')
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)

    useEffect(() => {
        if (geocodingLib) {
            setGeocoder(new geocodingLib.Geocoder())
        }
    }, [geocodingLib])

    useEffect(() => {
        // We don't auto-geocode on effect here to prevent spamming API on type
        // We will trigger manually via parent
    }, [address])

    // Expose geocode method via Ref or Context if needed, but here we can just pass a trigger prop
    // For simplicity, we'll manually call API in parent if we could, but library load is async.
    // Let's attach the geocode function to a window object or context? No, that's messy.

    // Clean solution: Return null, but define a function that the parent can call?
    // React Hooks cannot easily export functions to parent without Refs.

    return null
}


// --- Main Page Component ---

export default function CreatePropertyPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

    // Form State
    const [title, setTitle] = useState('')
    const [type, setType] = useState('RENT') // RENT, SALE, SHARE, DORMITORY
    const [price, setPrice] = useState('')
    const [currency, setCurrency] = useState('CAD')
    const [period, setPeriod] = useState('MONTHLY')
    const [bedrooms, setBedrooms] = useState('1')
    const [bathrooms, setBathrooms] = useState('1')
    const [description, setDescription] = useState('')
    const [region, setRegion] = useState(session?.user?.region || 'Toronto')

    // Address & Map State
    const [addressInput, setAddressInput] = useState('')
    const [confirmedAddress, setConfirmedAddress] = useState('')
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)

    // Features
    const [features, setFeatures] = useState<string[]>([])
    const [featureInput, setFeatureInput] = useState('')

    const handleAddFeature = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && featureInput.trim()) {
            e.preventDefault()
            if (!features.includes(featureInput.trim())) {
                setFeatures([...features, featureInput.trim()])
            }
            setFeatureInput('')
        }
    }

    const removeFeature = (feat: string) => {
        setFeatures(features.filter(f => f !== feat))
    }

    // Geocoding
    // Since useMapsLibrary needs to be inside APIProvider, we need to wrap the geocoding access.
    // Instead of a separate component, let's use a standard fetch to Google Geocoding API REST endpoint if cleaner,
    // OR strictly use the JS SDK.
    // To use JS SDK, we need to be inside APIProvider. 
    // Code structure:
    // <APIProvider>
    //    <CreatePropertyFormContent />
    // </APIProvider>

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <CreatePropertyFormContent
                // Pass all state and handlers
                state={{
                    title, setTitle, type, setType, price, setPrice, currency, setCurrency,
                    period, setPeriod, bedrooms, setBedrooms, bathrooms, setBathrooms,
                    description, setDescription, region, setRegion, images, setImages,
                    addressInput, setAddressInput, confirmedAddress, setConfirmedAddress,
                    location, setLocation, features, removeFeature, featureInput, setFeatureInput, handleAddFeature,
                    loading, setLoading
                }}
                session={session}
                router={router}
            />
        </APIProvider>
    )
}

function CreatePropertyFormContent({ state, session, router }: any) {
    const geocodingLib = useMapsLibrary('geocoding')
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)

    useEffect(() => {
        if (geocodingLib) {
            setGeocoder(new geocodingLib.Geocoder())
        }
    }, [geocodingLib])

    const handleSearchAddress = () => {
        if (!geocoder || !state.addressInput) return

        geocoder.geocode({ address: state.addressInput }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const loc = results[0].geometry.location
                state.setLocation({ lat: loc.lat(), lng: loc.lng() })
                state.setConfirmedAddress(results[0].formatted_address)
                toast.success("주소를 찾았습니다.")
            } else {
                toast.error("주소를 찾을 수 없습니다.")
            }
        })
    }

    const uploadImages = async (): Promise<string[]> => {
        if (state.images.length === 0) return []
        const formData = new FormData()
        state.images.forEach((file: File) => formData.append('file', file))

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (res.ok) {
                const data = await res.json()
                return data.urls || []
            }
        } catch (e) {
            console.error(e)
            toast.error("이미지 업로드 실패")
        }
        return []
    }

    const handleSubmit = async () => {
        if (!state.location) {
            toast.error("주소를 검색하여 위치를 확인해주세요.")
            return
        }
        if (!state.title || !state.price) {
            toast.error("제목과 가격은 필수입니다.")
            return
        }

        state.setLoading(true)
        try {
            const imageUrls = await uploadImages()

            const payload = {
                title: state.title,
                type: state.type,
                price: parseFloat(state.price),
                currency: state.currency,
                period: state.period,
                bedrooms: parseInt(state.bedrooms),
                bathrooms: parseFloat(state.bathrooms),
                description: state.description,
                address: state.confirmedAddress || state.addressInput,
                latitude: state.location.lat,
                longitude: state.location.lng,
                region: state.region,
                features: state.features,
                images: imageUrls
            }

            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                toast.success("매물이 등록되었습니다.")
                router.push('/real-estate')
            } else {
                throw new Error("Registration failed")
            }
        } catch (e) {
            toast.error("등록에 실패했습니다.")
        } finally {
            state.setLoading(false)
        }
    }

    return (
        <Container>
            <Header>
                <BackButton onClick={() => router.back()}>
                    <ChevronLeft size={28} />
                </BackButton>
                <Title>매물 등록</Title>
            </Header>

            <Form>
                <Section>
                    <Label>매물 유형</Label>
                    <Row>
                        <Select value={state.type} onChange={e => state.setType(e.target.value)}>
                            <option value="RENT">렌트 (Rent)</option>
                            <option value="SHARE">룸쉐어 (Share)</option>
                            <option value="DORMITORY">민박/도미토리</option>
                            <option value="SALE">매매 (Sale)</option>
                        </Select>
                        <Select value={state.period} onChange={e => state.setPeriod(e.target.value)}>
                            <option value="MONTHLY">월세 (Monthly)</option>
                            <option value="WEEKLY">주세 (Weekly)</option>
                            <option value="DAILY">일일 (Daily)</option>
                            <option value="SALE">매매 (Sale)</option>
                        </Select>
                    </Row>
                </Section>

                <Section>
                    <ImageUploader onImagesChange={state.setImages} />
                </Section>

                <Section>
                    <Label>주소 검색</Label>
                    <AddressSearchRow>
                        <Input
                            placeholder="주소 또는 우편번호 입력 (예: 123 Yonge St)"
                            value={state.addressInput}
                            onChange={e => state.setAddressInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearchAddress()}
                        />
                        <SearchButton onClick={handleSearchAddress}>
                            <Search size={20} />
                        </SearchButton>
                    </AddressSearchRow>
                    {state.confirmedAddress && (
                        <div style={{ fontSize: '0.85rem', color: '#059669', display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <Check size={14} /> {state.confirmedAddress}
                        </div>
                    )}

                    {state.location && (
                        <MapPreviewWrapper>
                            <Map
                                defaultCenter={state.location}
                                defaultZoom={15}
                                center={state.location}
                                mapId="PREVIEW_MAP"
                                disableDefaultUI={true}
                                gestureHandling={'none'}
                            >
                                <AdvancedMarker position={state.location} />
                            </Map>
                        </MapPreviewWrapper>
                    )}
                </Section>

                <Section>
                    <Label>제목</Label>
                    <Input
                        placeholder="매물 제목을 입력해주세요"
                        value={state.title}
                        onChange={e => state.setTitle(e.target.value)}
                    />
                </Section>

                <Section>
                    <Label>가격</Label>
                    <Row>
                        <Select style={{ width: '100px' }} value={state.currency} onChange={e => state.setCurrency(e.target.value)}>
                            <option value="CAD">CAD ($)</option>
                            <option value="KRW">KRW (₩)</option>
                        </Select>
                        <Input
                            type="number"
                            placeholder="가격"
                            value={state.price}
                            onChange={e => state.setPrice(e.target.value)}
                        />
                    </Row>
                </Section>

                <Section>
                    <Label>상세 정보</Label>
                    <Row>
                        <div style={{ flex: 1 }}>
                            <Label style={{ fontSize: '0.8rem' }}>Bedrooms</Label>
                            <Input type="number" value={state.bedrooms} onChange={e => state.setBedrooms(e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Label style={{ fontSize: '0.8rem' }}>Bathrooms</Label>
                            <Input type="number" value={state.bathrooms} step="0.5" onChange={e => state.setBathrooms(e.target.value)} />
                        </div>
                    </Row>
                </Section>

                <Section>
                    <Label>특징 (Features)</Label>
                    <TagInput>
                        {state.features.map((feat: string) => (
                            <TagChip key={feat}>
                                {feat}
                                <X size={14} style={{ cursor: 'pointer' }} onClick={() => state.removeFeature(feat)} />
                            </TagChip>
                        ))}
                        <input
                            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: '100px' }}
                            placeholder="입력 후 Enter (예: 주차가능, 와이파이)"
                            value={state.featureInput}
                            onChange={e => state.setFeatureInput(e.target.value)}
                            onKeyDown={state.handleAddFeature}
                        />
                    </TagInput>
                </Section>

                <Section>
                    <Label>설명</Label>
                    <TextArea
                        placeholder="매물에 대한 자세한 설명을 작성해주세요."
                        value={state.description}
                        onChange={e => state.setDescription(e.target.value)}
                    />
                </Section>

                <FixedButtonWrapper>
                    <SubmitButton onClick={handleSubmit} disabled={state.loading}>
                        {state.loading ? '등록 중...' : '매물 등록하기'}
                    </SubmitButton>
                </FixedButtonWrapper>
            </Form>
        </Container>
    )
}
