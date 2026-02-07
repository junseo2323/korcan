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

export default function ExpenseForm() {
    const { addExpense } = useExpenses()
    const { exchangeRate } = useCurrency()

    const [amount, setAmount] = useState('')
    const [currency, setCurrency] = useState<'CAD' | 'KRW'>('CAD')
    const [category, setCategory] = useState('')
    const [note, setNote] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount || !category) return

        addExpense({
            amount: parseFloat(amount),
            currency,
            category,
            date,
            note
        })

        setAmount('')
        setNote('')
    }

    const convertedPreview = amount
        ? currency === 'CAD'
            ? `≈ ${(parseFloat(amount) * exchangeRate).toLocaleString()} KRW`
            : `≈ ${(parseFloat(amount) / exchangeRate).toFixed(2)} CAD`
        : ''

    return (
        <FormContainer onSubmit={handleSubmit}>
            <h3 style={{ margin: 0 }}>Add Expense</h3>

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
                Add Expense
            </Button>
        </FormContainer>
    )
}
