'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePosts } from '@/contexts/PostContext'
import { useSession } from 'next-auth/react'
import { ChevronLeft, Image as ImageIcon, Calendar, MapPin, Users } from 'lucide-react'
import Toast from '@/components/ui/Toast'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  min-height: 100vh;
  background-color: white;
  max-width: 600px;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
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
`

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  padding: 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  outline: none;
  width: 100%;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
    font-weight: 400;
  }

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
`

const TextArea = styled.textarea`
  border: none;
  resize: none;
  height: 300px;
  font-size: 1rem;
  outline: none;
  line-height: 1.6;
  width: 100%;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
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
  margin-top: 2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: transform 0.1s;
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral.gray300};
    box-shadow: none;
    cursor: not-allowed;
  }
`

const CategoryButton = styled.button<{ $isSelected: boolean }>`
  padding: 0.5rem 1rem;
  borderRadius: 20px;
  border: none;
  background-color: ${({ $isSelected, theme }) => $isSelected ? theme.colors.primary : '#f3f4f6'};
  color: ${({ $isSelected }) => $isSelected ? 'white' : '#4b5563'};
  cursor: pointer;
  whiteSpace: nowrap;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
`

const ScopeButton = styled.button<{ $isSelected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ $isSelected, theme }) => $isSelected ? theme.colors.primary : '#e5e7eb'};
  background-color: ${({ $isSelected }) => $isSelected ? '#eff6ff' : 'white'};
  color: ${({ $isSelected, theme }) => $isSelected ? theme.colors.primary : '#6b7280'};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;
`

const MeetupFieldRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const IconInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.5rem 0;
  flex: 1;

  &:focus-within {
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
`

function WritePostContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addPost } = usePosts()
  const { data: session } = useSession()

  const type = searchParams.get('type') || 'board' // 'board' | 'meetup'
  const isMeetup = type === 'meetup'

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(isMeetup ? '모임' : '일반')
  const [loading, setLoading] = useState(false)
  const [existingCategories, setExistingCategories] = useState<string[]>(['일반', '질문', '정보', '잡담'])

  // Meetup States
  const [meetupDate, setMeetupDate] = useState('')
  const [maxMembers, setMaxMembers] = useState('4')
  const [meetupPlace, setMeetupPlace] = useState('')

  // Toast State
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })

  const showToast = (message: string) => {
    setToast({ show: true, message })
  }

  const [scope, setScope] = useState<'Local' | 'Global'>('Local')
  const [postImages, setPostImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setPostImages(prev => [...prev, ...files])

      const newPreviews = files.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setPostImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const uploadImages = async (): Promise<string[]> => {
    if (postImages.length === 0) return []

    const uploadedUrls: string[] = []
    // Upload one by one or batch? API supports batch.
    // Let's use batch.
    const formData = new FormData()
    postImages.forEach(file => formData.append('file', file))

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        // API returns { urls: string[] }
        return data.urls || (data.url ? [data.url] : [])
      }
    } catch (e) {
      console.error('Image upload failed', e)
      showToast('이미지 업로드에 실패했습니다.')
    }
    return []
  }

  const handleSubmit = async () => {
    if (!title || !content) return
    if (isMeetup && (!meetupDate || !maxMembers)) {
      showToast('날짜와 인원 수를 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      // 1. Upload Images
      const uploadedImageUrls = await uploadImages()

      // 2. Determine region value
      const regionValue = scope === 'Global' ? 'Global' : (session?.user?.region || 'Global')

      const meetupData = isMeetup ? {
        date: meetupDate,
        maxMembers,
        place: meetupPlace,
        image: uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : null // Use first image as thumbnail
      } : null

      // 3. Add Post with Images
      await addPost(title, content, category, regionValue, meetupData, uploadedImageUrls)
      router.back()
    } catch (e) {
      showToast('글 작성에 실패했습니다.')
      setLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ChevronLeft size={28} />
        </BackButton>
        <Title>{isMeetup ? '모임 만들기' : '글쓰기'}</Title>
      </Header>

      <Form>
        {/* Category & Scope Selection */}
        {!isMeetup && (
          <Section>
            <Label>카테고리</Label>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
              {existingCategories.map(cat => (
                <CategoryButton
                  key={cat}
                  $isSelected={category === cat}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </CategoryButton>
              ))}
            </div>
          </Section>
        )}

        <Section>
          <Label>지역 설정</Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ScopeButton
              $isSelected={scope === 'Local'}
              onClick={() => setScope('Local')}
            >
              {session?.user?.region ? `${session.user.region} (내 지역)` : '내 지역'}
            </ScopeButton>
            <ScopeButton
              $isSelected={scope === 'Global'}
              onClick={() => setScope('Global')}
            >
              캐나다 전체 (Global)
            </ScopeButton>
          </div>
        </Section>

        {isMeetup && (
          <>
            <MeetupFieldRow>
              <Section style={{ flex: 1 }}>
                <Label>날짜 및 시간</Label>
                <IconInputWrapper>
                  <Calendar size={20} color="#9ca3af" />
                  <Input
                    type="datetime-local"
                    value={meetupDate}
                    onChange={(e) => setMeetupDate(e.target.value)}
                    style={{ fontSize: '0.95rem', fontWeight: 400 }}
                  />
                </IconInputWrapper>
              </Section>
            </MeetupFieldRow>

            <MeetupFieldRow>
              <Section style={{ flex: 1 }}>
                <Label>최대 인원</Label>
                <IconInputWrapper>
                  <Users size={20} color="#9ca3af" />
                  <Input
                    type="number"
                    min="2"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(e.target.value)}
                    style={{ fontSize: '0.95rem', fontWeight: 400 }}
                  />
                </IconInputWrapper>
              </Section>
            </MeetupFieldRow>

            {/* 
                <Section>
                    <Label>장소 (선택)</Label>
                    <IconInputWrapper>
                        <MapPin size={20} color="#9ca3af" />
                        <Input 
                            placeholder="모임 장소를 입력하세요 (예: 강남역 11번 출구)" 
                            value={meetupPlace}
                            onChange={(e) => setMeetupPlace(e.target.value)}
                            style={{ fontSize: '0.95rem', fontWeight: 400 }}
                        />
                    </IconInputWrapper>
                </Section>
                */}
          </>
        )}

        <Section>
          <Label>사진 첨부</Label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{
              width: '80px', height: '80px',
              borderRadius: '8px', border: '1px dashed #cbd5e1',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', fontSize: '0.8rem', gap: '4px'
            }}>
              <ImageIcon size={24} />
              <span>{postImages.length}/10</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>

            {previewUrls.map((url, idx) => (
              <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                <img src={url} style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                <button
                  onClick={() => removeImage(idx)}
                  style={{
                    position: 'absolute', top: -6, right: -6,
                    backgroundColor: '#ef4444', color: 'white',
                    border: 'none', borderRadius: '50%', width: '20px', height: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', cursor: 'pointer'
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ fontSize: '1.2rem', padding: '1rem 0' }}
          />
          <TextArea
            placeholder={isMeetup ? "모임에 대한 자세한 설명을 적어주세요." : "내용을 입력하세요."}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </Section>

        <SubmitButton onClick={handleSubmit} disabled={!title || !content || loading}>
          {loading ? '저장 중...' : '완료'}
        </SubmitButton>
      </Form>

      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </Container >
  )
}

export default function WritePostPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <WritePostContent />
    </React.Suspense>
  )
}
