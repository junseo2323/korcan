'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useExpenses } from '@/hooks/useExpenses'
import CategorySelector from './CategorySelector'
import { Button } from '@/components/design-system/Button'
import { Input } from '@/components/design-system/Input'

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
`

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.body2};
  background-color: ${({ theme }) => theme.colors.neutral.white};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const CurrencyToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`

interface ExpenseFormProps {
    initialData?: {
        id: string
        amount: number
        currency: 'CAD' | 'KRW'
        category: string
        date: string
        note: string
        tags?: string[]
    }
    onSubmit?: (data: any) => Promise<void>
    onCancel?: () => void
}

export default function ExpenseForm({ initialData, onSubmit, onCancel }: ExpenseFormProps) {
    const { addExpense } = useExpenses()
    const { exchangeRate } = useCurrency()

    const [amount, setAmount] = useState(initialData?.amount?.toString() || '')
    const [currency, setCurrency] = useState<'CAD' | 'KRW'>(initialData?.currency || 'CAD')
    const [category, setCategory] = useState(initialData?.category || '')
    const [note, setNote] = useState(initialData?.note || '')
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0])

    // If updating, maybe we want to keep existing tags or allow editing?
    // For now, let's just preserve them if not exposed in UI yet.
    // But this form doesn't have tag editing UI yet except via receipt logic?
    // Let's assume tags are preserved in updates.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount || !category) return

        const expenseData = {
            amount: parseFloat(amount),
            currency,
            category,
            date,
            note
        }

        if (onSubmit) {
            await onSubmit(expenseData)
        } else {
            await addExpense(expenseData)
            setAmount('')
            setNote('')
            setCategory('')
        }
    }

    const convertedPreview = amount
        ? currency === 'CAD'
            ? `≈ ${(parseFloat(amount) * exchangeRate).toLocaleString()} KRW`
            : `≈ ${(parseFloat(amount) / exchangeRate).toFixed(2)} CAD`
        : ''

    return (
        <FormContainer onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{initialData ? '내역 수정' : 'Add Expense'}</h3>
            </div>

            <CurrencyToggle>
                <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'CAD' | 'KRW')}
                    style={{ height: '44px' }}
                >
                    <option value="CAD">CAD ($)</option>
                    <option value="KRW">KRW (₩)</option>
                </Select>
                <div style={{ flex: 1 }}>
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        fullWidth
                    />
                    {convertedPreview && (
                        <small style={{ display: 'block', marginTop: '4px', color: '#888' }}>
                            {convertedPreview}
                        </small>
                    )}
                </div>
            </CurrencyToggle>

            <CategorySelector
                selectedCategory={category}
                onSelect={(cat) => setCategory(cat)}
                allowCreation={!initialData}
            />

            <Input
                type="date"
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />

            <Input
                type="text"
                label="Note (Optional)"
                placeholder="Details about expense"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />

            <Button type="submit" fullWidth size="large">
                {initialData ? '수정 완료' : 'Add Expense'}
            </Button>

            {onCancel && (
                <Button type="button" fullWidth size="large" variant="secondary" onClick={onCancel} style={{ marginTop: '0.5rem' }}>
                    취소
                </Button>
            )}
        </FormContainer>
    )
}
