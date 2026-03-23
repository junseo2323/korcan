'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ChevronLeft, Check, Search, X } from 'lucide-react'
import { APIProvider, Map, AdvancedMarker, useMapsLibrary } from '@vis.gl/react-google-maps'
import { toast } from 'sonner'
import Image from 'next/image'

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
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`
const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  width: 100%;
  background: white;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`
const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  width: 100%;
  min-height: 120px;
  resize: vertical;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
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
  bottom: calc(60px + env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  z-index: 100;
  @media (min-width: 768px) { bottom: 0; }
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
  &:disabled { background-color: ${({ theme }) => theme.colors.neutral.gray300}; cursor: not-allowed; }
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
const ImageGrid = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`
const ImageThumb = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`
const RemoveImageBtn = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0,0,0,0.6);
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
`
const AddImageLabel = styled.label`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px dashed ${({ theme }) => theme.colors.border.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

export default function EditPropertyPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const id = params.id as string

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [title, setTitle] = useState('')
    const [type, setType] = useState('RENT')
    const [price, setPrice] = useState('')
    const [currency, setCurrency] = useState('CAD')
    const [period, setPeriod] = useState('MONTHLY')
    const [bedrooms, setBedrooms] = useState('1')
    const [bathrooms, setBathrooms] = useState('1')
    const [description, setDescription] = useState('')
    const [region, setRegion] = useState('')
    const [addressInput, setAddressInput] = useState('')
    const [confirmedAddress, setConfirmedAddress] = useState('')
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [contactType, setContactType] = useState('KAKAO')
    const [contactValue, setContactValue] = useState('')
    const [features, setFeatures] = useState<string[]>([])
    const [featureInput, setFeatureInput] = useState('')
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [newImages, setNewImages] = useState<File[]>([])

    useEffect(() => {
        fetch(`/api/properties/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.userId !== session?.user?.id) {
                    toast.error('권한이 없습니다.')
                    router.push(`/real-estate/${id}`)
                    return
                }
                setTitle(data.title)
                setType(data.type)
                setPrice(String(data.price))
                setCurrency(data.currency)
                setPeriod(data.period)
                setBedrooms(String(data.bedrooms))
                setBathrooms(String(data.bathrooms))
                setDescription(data.description || '')
                setRegion(data.region || '')
                setAddressInput(data.address || '')
                setConfirmedAddress(data.address || '')
                setLocation({ lat: data.latitude, lng: data.longitude })
                setContactType(data.contactType || 'KAKAO')
                setContactValue(data.contactValue || '')
                setFeatures(
                    Array.isArray(data.features)
                        ? data.features
                        : data.features ? data.features.split(',').map((f: string) => f.trim()) : []
                )
                setExistingImages((data.images || []).map((img: { url: string }) => img.url))
            })
            .finally(() => setFetching(false))
    }, [id, session, router])

    if (fetching) return <div style={{ padding: '2rem' }}>Loading...</div>

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <EditFormContent
                id={id}
                router={router}
                state={{
                    loading, setLoading,
                    title, setTitle, type, setType, price, setPrice,
                    currency, setCurrency, period, setPeriod,
                    bedrooms, setBedrooms, bathrooms, setBathrooms,
                    description, setDescription, region, setRegion,
                    addressInput, setAddressInput, confirmedAddress, setConfirmedAddress,
                    location, setLocation,
                    contactType, setContactType, contactValue, setContactValue,
                    features, setFeatures, featureInput, setFeatureInput,
                    existingImages, setExistingImages, newImages, setNewImages,
                }}
            />
        </APIProvider>
    )
}

function EditFormContent({ id, router, state }: any) {
    const geocodingLib = useMapsLibrary('geocoding')
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)

    useEffect(() => {
        if (geocodingLib) setGeocoder(new geocodingLib.Geocoder())
    }, [geocodingLib])

    const handleSearchAddress = () => {
        if (!geocoder || !state.addressInput) return
        geocoder.geocode(
            { address: state.addressInput, componentRestrictions: { country: 'CA' } },
            (results, status) => {
                if (status === 'OK' && results?.[0]) {
                    const loc = results[0].geometry.location
                    state.setLocation({ lat: loc.lat(), lng: loc.lng() })
                    state.setConfirmedAddress(results[0].formatted_address)
                    toast.success('주소를 찾았습니다.')
                } else {
                    toast.error('주소를 찾을 수 없습니다.')
                }
            }
        )
    }

    const handleAddFeature = (e: React.KeyboardEvent) => {
        if (e.nativeEvent.isComposing) return
        if (e.key === 'Enter' && state.featureInput.trim()) {
            e.preventDefault()
            if (!state.features.includes(state.featureInput.trim())) {
                state.setFeatures([...state.features, state.featureInput.trim()])
            }
            state.setFeatureInput('')
        }
    }

    const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            state.setNewImages([...state.newImages, ...Array.from(e.target.files)])
        }
    }

    const uploadNewImages = async (): Promise<string[]> => {
        if (state.newImages.length === 0) return []
        const formData = new FormData()
        state.newImages.forEach((file: File) => formData.append('file', file))
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (res.ok) {
            const data = await res.json()
            return data.urls || []
        }
        return []
    }

    const handleSubmit = async () => {
        if (!state.location) { toast.error('주소를 검색하여 위치를 확인해주세요.'); return }
        if (!state.title || !state.price) { toast.error('제목과 가격은 필수입니다.'); return }

        state.setLoading(true)
        try {
            const newUrls = await uploadNewImages()
            const allImages = [...state.existingImages, ...newUrls]

            const res = await fetch(`/api/properties/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
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
                    contactType: state.contactType,
                    contactValue: state.contactValue,
                    images: allImages,
                }),
            })

            if (res.ok) {
                toast.success('매물이 수정되었습니다.')
                router.push(`/real-estate/${id}`)
            } else {
                throw new Error()
            }
        } catch {
            toast.error('수정에 실패했습니다.')
        } finally {
            state.setLoading(false)
        }
    }

    return (
        <Container>
            <Header>
                <BackButton onClick={() => router.back()}><ChevronLeft size={28} /></BackButton>
                <Title>매물 수정</Title>
            </Header>

            <Form>
                <Section>
                    <Label>매물 유형</Label>
                    <Row>
                        <Select value={state.type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => state.setType(e.target.value)}>
                            <option value="RENT">렌트 (Rent)</option>
                            <option value="SHARE">룸쉐어 (Share)</option>
                            <option value="DORMITORY">민박/도미토리</option>
                            <option value="SALE">매매 (Sale)</option>
                        </Select>
                        <Select value={state.period} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => state.setPeriod(e.target.value)}>
                            <option value="MONTHLY">월세 (Monthly)</option>
                            <option value="WEEKLY">주세 (Weekly)</option>
                            <option value="DAILY">일일 (Daily)</option>
                            <option value="SALE">매매 (Sale)</option>
                        </Select>
                    </Row>
                </Section>

                <Section>
                    <Label>이미지</Label>
                    <ImageGrid>
                        {state.existingImages.map((url: string, i: number) => (
                            <ImageThumb key={url}>
                                <Image src={url} alt={`image-${i}`} fill sizes="80px" style={{ objectFit: 'cover' }} />
                                <RemoveImageBtn onClick={() => state.setExistingImages(state.existingImages.filter((_: string, idx: number) => idx !== i))}>
                                    <X size={12} />
                                </RemoveImageBtn>
                            </ImageThumb>
                        ))}
                        {state.newImages.map((file: File, i: number) => (
                            <ImageThumb key={`new-${i}`}>
                                <Image src={URL.createObjectURL(file)} alt={`new-${i}`} fill sizes="80px" style={{ objectFit: 'cover' }} />
                                <RemoveImageBtn onClick={() => state.setNewImages(state.newImages.filter((_: File, idx: number) => idx !== i))}>
                                    <X size={12} />
                                </RemoveImageBtn>
                            </ImageThumb>
                        ))}
                        <AddImageLabel>
                            +
                            <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleNewImageChange} />
                        </AddImageLabel>
                    </ImageGrid>
                </Section>

                <Section>
                    <Label>주소 검색</Label>
                    <AddressSearchRow>
                        <Input
                            placeholder="주소 입력 (예: 123 Yonge St)"
                            value={state.addressInput}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setAddressInput(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearchAddress()}
                        />
                        <SearchButton onClick={handleSearchAddress}><Search size={20} /></SearchButton>
                    </AddressSearchRow>
                    {state.confirmedAddress && (
                        <div style={{ fontSize: '0.85rem', color: '#059669', display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <Check size={14} /> {state.confirmedAddress}
                        </div>
                    )}
                    {state.location && (
                        <MapPreviewWrapper>
                            <Map defaultCenter={state.location} defaultZoom={15} center={state.location} mapId="EDIT_MAP" disableDefaultUI gestureHandling="none">
                                <AdvancedMarker position={state.location} />
                            </Map>
                        </MapPreviewWrapper>
                    )}
                </Section>

                <Section>
                    <Label>제목</Label>
                    <Input value={state.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setTitle(e.target.value)} />
                </Section>

                <Section>
                    <Label>가격</Label>
                    <Row>
                        <Select style={{ width: '100px' }} value={state.currency} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => state.setCurrency(e.target.value)}>
                            <option value="CAD">CAD ($)</option>
                            <option value="KRW">KRW (₩)</option>
                        </Select>
                        <Input type="number" value={state.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setPrice(e.target.value)} />
                    </Row>
                </Section>

                <Section>
                    <Label>상세 정보</Label>
                    <Row>
                        <div style={{ flex: 1 }}>
                            <Label style={{ fontSize: '0.8rem' }}>Bedrooms</Label>
                            <Input type="number" value={state.bedrooms} onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setBedrooms(e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Label style={{ fontSize: '0.8rem' }}>Bathrooms</Label>
                            <Input type="number" value={state.bathrooms} step="0.5" onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setBathrooms(e.target.value)} />
                        </div>
                    </Row>
                </Section>

                <Section>
                    <Label>특징 (Features)</Label>
                    <TagInput>
                        {state.features.map((feat: string) => (
                            <TagChip key={feat}>
                                {feat}
                                <X size={14} style={{ cursor: 'pointer' }} onClick={() => state.setFeatures(state.features.filter((f: string) => f !== feat))} />
                            </TagChip>
                        ))}
                        <input
                            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: '100px' }}
                            placeholder="입력 후 Enter"
                            value={state.featureInput}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setFeatureInput(e.target.value)}
                            onKeyDown={handleAddFeature}
                        />
                    </TagInput>
                </Section>

                <Section>
                    <Label>연락처</Label>
                    <Row>
                        <Select style={{ width: '140px' }} value={state.contactType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => state.setContactType(e.target.value)}>
                            <option value="KAKAO">카카오톡 ID</option>
                            <option value="PHONE">전화번호</option>
                            <option value="EMAIL">이메일</option>
                            <option value="LINK">링크 (URL)</option>
                        </Select>
                        <Input value={state.contactValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setContactValue(e.target.value)} />
                    </Row>
                </Section>

                <Section>
                    <Label>설명</Label>
                    <TextArea value={state.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => state.setDescription(e.target.value)} />
                </Section>

                <FixedButtonWrapper>
                    <SubmitButton onClick={handleSubmit} disabled={state.loading}>
                        {state.loading ? '수정 중...' : '수정 완료'}
                    </SubmitButton>
                </FixedButtonWrapper>
            </Form>
        </Container>
    )
}
