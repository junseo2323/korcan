'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useExpenses } from '@/hooks/useExpenses'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Trash, Calendar, Repeat } from 'lucide-react'

const Container = styled.div`
  padding: 1rem;
`

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`

const RuleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`

const RuleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`

const RuleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const CategoryBox = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`

const RuleText = styled.div`
  display: flex;
  flex-direction: column;
`

const RuleName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`

const RuleDetail = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.status.error};
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    opacity: 0.7;
  }
`

const AddForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: ${({ theme }) => theme.colors.neutral.gray100};
  padding: 1rem;
  border-radius: 12px;
`

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  outline: none;
`

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  background-color: white;
`

const Button = styled.button`
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  
  &:disabled {
      background-color: ${({ theme }) => theme.colors.neutral.gray300};
  }
`

const FormRow = styled.div`
  display: flex;
  gap: 0.5rem;
`

export default function FixedExpenseManager() {
    const { recurringRules, addRecurringRule, removeRecurringRule } = useExpenses()
    const { currency } = useCurrency()

    // Form State
    const [name, setName] = useState('') // Category/Note
    const [amount, setAmount] = useState('')
    const [day, setDay] = useState('10') // Default 10th
    const [freq, setFreq] = useState<'monthly' | 'weekly'>('monthly')

    const handleAdd = () => {
        if (!name || !amount) return

        addRecurringRule({
            category: '정기지출', // Or make this dynamic
            note: name,
            amount: parseFloat(amount),
            currency: currency, // Use current context currency
            frequency: freq,
            day: parseInt(day)
        })

        setName('')
        setAmount('')
    }

    const getRecurrenceLabel = (frequency: string, dayVal: number) => {
        if (frequency === 'monthly') return `매달 ${dayVal}일`
        const weeks = ['일', '월', '화', '수', '목', '금', '토']
        return `매주 ${weeks[dayVal]}요일`
    }

    return (
        <Container>
            <Title>정기 소비 관리</Title>

            <RuleList>
                {recurringRules.length === 0 && <p style={{ color: '#999', textAlign: 'center' }}>등록된 정기 소비가 없습니다.</p>}
                {recurringRules.map(rule => (
                    <RuleItem key={rule.id}>
                        <RuleInfo>
                            <CategoryBox><Repeat size={20} /></CategoryBox>
                            <RuleText>
                                <RuleName>{rule.note}</RuleName>
                                <RuleDetail>
                                    {getRecurrenceLabel(rule.frequency, rule.day)} • {rule.amount.toLocaleString()} {rule.currency}
                                </RuleDetail>
                            </RuleText>
                        </RuleInfo>
                        <DeleteButton onClick={() => removeRecurringRule(rule.id)}>
                            <Trash size={18} />
                        </DeleteButton>
                    </RuleItem>
                ))}
            </RuleList>

            <AddForm>
                <h4>새 정기 소비 추가</h4>
                <Input
                    placeholder="항목 이름 (예: 월세, 넷플릭스)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <FormRow>
                    <Input
                        type="number"
                        placeholder="금액"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <Select value={currency} disabled style={{ width: '80px' }}>
                        <option value="CAD">CAD</option>
                        <option value="KRW">KRW</option>
                    </Select>
                </FormRow>

                <FormRow>
                    <Select value={freq} onChange={(e) => setFreq(e.target.value as any)} style={{ flex: 1 }}>
                        <option value="monthly">매달</option>
                        <option value="weekly">매주</option>
                    </Select>

                    {freq === 'monthly' ? (
                        <Select value={day} onChange={e => setDay(e.target.value)} style={{ flex: 1 }}>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}일</option>
                            ))}
                        </Select>
                    ) : (
                        <Select value={day} onChange={e => setDay(e.target.value)} style={{ flex: 1 }}>
                            <option value="0">일요일</option>
                            <option value="1">월요일</option>
                            <option value="2">화요일</option>
                            <option value="3">수요일</option>
                            <option value="4">목요일</option>
                            <option value="5">금요일</option>
                            <option value="6">토요일</option>
                        </Select>
                    )}
                </FormRow>

                <Button onClick={handleAdd} disabled={!name || !amount}>추가하기</Button>
            </AddForm>
        </Container>
    )
}
