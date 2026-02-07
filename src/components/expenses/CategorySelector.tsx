'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Input } from '@/components/design-system/Input'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const TagChip = styled.button<{ $selected?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.secondary : theme.colors.background.primary};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.text.white : theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.secondary : theme.colors.background.secondary};
  }
`

const InputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`

const AddButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.white};
  border: none;
  border-radius: 4px;
  padding: 0 1rem;
  cursor: pointer;
  height: 44px; /* Match Input height approx */
  font-weight: bold;
  
  &:hover {
      background-color: ${({ theme }) => theme.colors.primaryStrong};
  }
`

interface CategorySelectorProps {
  selectedCategory: string
  onSelect: (category: string) => void
}

const DEFAULT_TAGS = ['Food', 'Transport', 'Shopping', 'Housing', 'Utilities']

export default function CategorySelector({ selectedCategory, onSelect }: CategorySelectorProps) {
  const [customTags, setCustomTags] = useLocalStorage<string[]>('korcan_custom_tags', [])
  const [newTag, setNewTag] = useState('')

  const allTags = Array.from(new Set([...DEFAULT_TAGS, ...customTags]))

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTag.trim()) return
    const tag = newTag.trim()
    if (!allTags.includes(tag)) {
      setCustomTags((prev) => [...prev, tag])
    }
    onSelect(tag)
    setNewTag('')
  }

  return (
    <Container>
      <div style={{ fontWeight: 'bold' }}>Category</div>
      <TagList>
        {allTags.map(tag => (
          <TagChip
            key={tag}
            type="button"
            $selected={selectedCategory === tag}
            onClick={() => onSelect(tag)}
          >
            {tag}
          </TagChip>
        ))}
      </TagList>
      <form onSubmit={handleAdd} style={{ marginTop: '0.5rem' }}>
        <InputWrapper>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="New Category..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              fullWidth
            />
          </div>
          <AddButton type="submit">+</AddButton>
        </InputWrapper>
        <small style={{ opacity: 0.6, fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>Create or select a tag</small>
      </form>
    </Container>
  )
}
