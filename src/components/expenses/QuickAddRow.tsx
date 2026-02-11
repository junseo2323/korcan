'use client'

import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Plus, Coffee, ShoppingBag, Home, Bus, Zap, MoreHorizontal, Utensils, Check, Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useExpenses } from '@/hooks/useExpenses'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { useCurrency } from '@/contexts/CurrencyContext'

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  gap: 0.75rem;
`

const IconSelect = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.neutral.gray100};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  flex-shrink: 0;
`

const InputGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const AmountInput = styled.input`
  border: none;
  font-size: 1rem;
  font-weight: bold;
  width: 100%;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`

const NoteInput = styled.input`
  border: none;
  font-size: 0.8rem;
  width: 100%;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`

const SubmitButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral.gray300};
    cursor: not-allowed;
  }
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledLoader = styled(Loader2)`
  animation: ${rotate} 1s linear infinite;
`

// Simplified categories for quick add
const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Other']

interface Props {
  selectedDate?: Date | null
}

export default function QuickAddRow({ selectedDate }: Props) {
  const { addExpense } = useExpenses()
  const { currency } = useCurrency()

  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [category, setCategory] = useState('Food')
  const [tags, setTags] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      toast.info('Analyzing receipt...')
      const response = await fetch('/api/receipt/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()

      if (data.total_amount) setAmount(data.total_amount.toString())
      if (data.merchant_name) setNote(data.merchant_name)
      if (data.tags && Array.isArray(data.tags)) setTags(data.tags)

      if (data.category && CATEGORIES.includes(data.category)) {
        setCategory(data.category)
      } else if (data.category) {
        // Map unknown categories to 'Other' or keep existing logic
        setCategory('Other')
      }

      toast.success('Receipt analyzed successfully!')
    } catch (error) {
      console.error('Error analyzing receipt:', error)
      toast.error('Failed to analyze receipt')
    } finally {
      setIsAnalyzing(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const cycleCategory = () => {
    const idx = CATEGORIES.indexOf(category)
    const next = CATEGORIES[(idx + 1) % CATEGORIES.length]
    setCategory(next)
  }

  const handleSubmit = () => {
    if (!amount) return

    // Default to today if no date selected
    const dateToUse = selectedDate || new Date()

    const newExpense = {
      id: uuidv4(),
      amount: parseFloat(amount),
      currency: currency,
      category,
      date: format(dateToUse, 'yyyy-MM-dd'),
      note: note || category,
      tags: tags
    }

    addExpense(newExpense)
    setAmount('')
    setNote('')
    setTags([])
  }

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Food': return <Utensils size={18} />
      case 'Transport': return <Bus size={18} />
      case 'Shopping': return <ShoppingBag size={18} />
      default: return <MoreHorizontal size={18} />
    }
  }

  return (
    <Container>
      <IconSelect onClick={cycleCategory} type="button">
        {getIcon(category)}
      </IconSelect>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileUpload}
      />
      <IconSelect
        as="div"
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        style={{ cursor: isAnalyzing ? 'wait' : 'pointer', opacity: isAnalyzing ? 0.7 : 1 }}
      >
        {isAnalyzing ? <StyledLoader size={18} /> : <Camera size={18} />}
      </IconSelect>
      <InputGroup>
        <AmountInput
          type="number"
          placeholder={`Amount (${currency === 'CAD' ? '$' : '₩'})`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <NoteInput
          placeholder="Memo (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </InputGroup>
      <SubmitButton onClick={handleSubmit} disabled={!amount}>
        <Check size={18} />
      </SubmitButton>
    </Container>
  )
}
