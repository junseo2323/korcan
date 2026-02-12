'use client'

import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { useMarket } from '@/contexts/MarketContext'
import { ChevronLeft, Camera, X } from 'lucide-react'
import Toast from '@/components/ui/Toast'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  min-height: 100vh;
  background-color: white;
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

const ImageUploadContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`

const ImageUploadButton = styled.button`
  width: 80px;
  height: 80px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  gap: 4px;
  font-size: 0.8rem;
  background: none;
  cursor: pointer;
  flex-shrink: 0;
`

const PreviewImageWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  flex-shrink: 0;
`

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const DeleteImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  padding: 0.75rem 0;
  font-size: 1rem;
  outline: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`

const Select = styled.select`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  padding: 0.75rem 0;
  font-size: 1rem;
  outline: none;
  background: white;
  color: ${({ theme }) => theme.colors.text.primary};
`

const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  border-radius: 8px;
  padding: 1rem;
  resize: none;
  height: 150px;
  font-size: 1rem;
  outline: none;
  line-height: 1.5;
  margin-top: 0.5rem;
  
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
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral.gray300};
  }
`

const CATEGORIES = ['Digital', 'Furniture', 'Clothing', 'Books', 'Other']

export default function SellPage() {
  const router = useRouter()
  const { addProduct } = useMarket()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Toast State
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })

  const showToast = (message: string) => {
    setToast({ show: true, message })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        setImageUrl(data.url)
      } else {
        showToast('이미지 업로드 실패')
      }
    } catch (e) {
      console.error(e)
      showToast('이미지 업로드 오류')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!title || !price || !description) return
    setLoading(true)
    const success = await addProduct(title, parseFloat(price), description, category, imageUrl)
    if (success) {
      router.push('/market')
    } else {
      showToast('상품 등록에 실패했습니다.')
      setLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </BackButton>
        <Title>내 물건 팔기</Title>
      </Header>

      <Form>
        <ImageUploadContainer>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <ImageUploadButton onClick={() => fileInputRef.current?.click()}>
            <Camera size={24} />
            <span>{imageUrl ? '1/1' : '0/1'}</span>
          </ImageUploadButton>

          {imageUrl && (
            <PreviewImageWrapper>
              <PreviewImage src={imageUrl} alt="Preview" />
              <DeleteImageButton onClick={() => setImageUrl('')}>
                <X size={12} />
              </DeleteImageButton>
            </PreviewImageWrapper>
          )}
          {uploading && <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>업로드 중...</div>}
        </ImageUploadContainer>

        <InputGroup>
          <Label>제목</Label>
          <Input
            placeholder="글 제목"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label>카테고리</Label>
          <Select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>가격</Label>
          <Input
            type="number"
            placeholder="$ 가격을 입력해주세요"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label>자세한 설명</Label>
          <TextArea
            placeholder="신뢰할 수 있는 거래를 위해 자세히 적어주세요."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </InputGroup>

        <SubmitButton onClick={handleSubmit} disabled={!title || !price || !description || loading || uploading}>
          {loading ? '등록 중...' : '등록하기'}
        </SubmitButton>
      </Form>

      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </Container>
  )
}
