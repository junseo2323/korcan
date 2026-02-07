'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { usePosts } from '@/contexts/PostContext'
import { ChevronLeft } from 'lucide-react'

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

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  padding: 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  outline: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`

const TextArea = styled.textarea`
  border: none;
  resize: none;
  height: 300px;
  font-size: 1rem;
  outline: none;
  line-height: 1.5;
  
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
  margin-top: auto;
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral.gray300};
  }
`

export default function WritePostPage() {
  const router = useRouter()
  const { addPost } = usePosts()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title || !content) return
    setLoading(true)
    try {
      await addPost(title, content)
      router.back()
    } catch (e) {
      alert('글 작성에 실패했습니다.')
      setLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </BackButton>
        <Title>글쓰기</Title>
      </Header>

      <Form>
        <Input
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <TextArea
          placeholder="내용을 입력하세요."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <SubmitButton onClick={handleSubmit} disabled={!title || !content || loading}>
          {loading ? '저장 중...' : '완료'}
        </SubmitButton>
      </Form>
    </Container>
  )
}
