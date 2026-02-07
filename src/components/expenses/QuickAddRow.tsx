'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Plus, Coffee, ShoppingBag, Home, Bus, Zap, MoreHorizontal, Utensils, Check } from 'lucide-react'
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
      tags: []
    }

    addExpense(newExpense)
    setAmount('')
    setNote('')
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
