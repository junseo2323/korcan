'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { useMarket } from '@/contexts/MarketContext'
import { ChevronLeft, Camera } from 'lucide-react'

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

const ImageUpload = styled.button`
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

    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState(CATEGORIES[0])
    const [description, setDescription] = useState('')

    const handleSubmit = () => {
        if (!title || !price || !description) return
        addProduct(title, parseFloat(price), description, category)
        router.back()
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
                <ImageUpload type="button">
                    <Camera size={24} />
                    <span>0/10</span>
                </ImageUpload>

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

                <SubmitButton onClick={handleSubmit} disabled={!title || !price || !description}>
                    등록하기
                </SubmitButton>
            </Form>
        </Container>
    )
}
