'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useExpenses } from '@/hooks/useExpenses'
import { useCurrency } from '@/contexts/CurrencyContext'
import { parseISO, format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Coffee, ShoppingBag, Home, Bus, Zap, MoreHorizontal, Utensils } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmModal from '@/components/ui/ConfirmModal'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 80px; /* Space for FAB */
`

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`

const DateHeader = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  padding: 0 1rem;
`

const ExpenseItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: transparent;
  cursor: pointer;
  
  &:active {
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const IconCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.neutral.gray100};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`

const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const CategoryTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Subtitle = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const TagsContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
`

const TagBadge = styled.span`
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  background-color: ${({ theme }) => theme.colors.neutral.gray100};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: 4px;
`

const RightSection = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const AmountMain = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`

const AmountSub = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

// Helper to get icon
const getCategoryIcon = (category: string) => {
  const term = category.toLowerCase()
  if (term.includes('food') || term.includes('meal')) return <Utensils size={20} />
  if (term.includes('coffee') || term.includes('cafe')) return <Coffee size={20} />
  if (term.includes('transport') || term.includes('bus') || term.includes('uber')) return <Bus size={20} />
  if (term.includes('shop') || term.includes('shopping')) return <ShoppingBag size={20} />
  if (term.includes('home') || term.includes('housing') || term.includes('rent')) return <Home size={20} />
  if (term.includes('util')) return <Zap size={20} />
  return <MoreHorizontal size={20} />
}

interface Props {
  selectedDate: Date | null
}

export default function ExpenseList({ selectedDate }: Props) {
  const { expenses, removeExpense } = useExpenses()
  const { currency, exchangeRate } = useCurrency()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (deleteId) {
      removeExpense(deleteId)
      toast.success('Successfully deleted')
      setDeleteId(null)
    }
  }

  // Filter expenses
  const filteredExpenses = selectedDate
    ? expenses.filter(e => e.date === format(selectedDate, 'yyyy-MM-dd'))
    : expenses

  // Group by Date
  const groupedExpenses = filteredExpenses.reduce((groups, expense) => {
    const date = expense.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(expense)
    return groups
  }, {} as Record<string, typeof expenses>)

  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <ListContainer>
      {expenses.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
          내역이 없습니다. + 버튼을 눌러 추가해보세요.
        </div>
      )}

      {expenses.length > 0 && filteredExpenses.length === 0 && selectedDate && (
        <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
          {format(selectedDate, 'M월 d일')}에 소비 내역이 없습니다.
        </div>
      )}

      {sortedDates.map((date) => {
        const dateObj = parseISO(date)
        const dateLabel = format(dateObj, 'd일 EEEE', { locale: ko }) // "7일 토요일"

        return (
          <GroupContainer key={date}>
            <DateHeader>{dateLabel}</DateHeader>
            {groupedExpenses[date].map((exp) => {
              // Calculate dual currency values
              const isKRWPrimary = currency === 'KRW'

              let mainAmount = 0
              let subAmountLabel = ''

              if (exp.currency === currency) {
                mainAmount = exp.amount
                // Calculate sub
                const otherVal = currency === 'CAD'
                  ? exp.amount * exchangeRate
                  : exp.amount / exchangeRate
                subAmountLabel = currency === 'CAD'
                  ? `(≈ ${Math.round(otherVal).toLocaleString()}원)`
                  : `(≈ ${otherVal.toFixed(2)} CAD)`
              } else {
                // Exp currency is different from view currency
                mainAmount = currency === 'CAD'
                  ? exp.amount / exchangeRate
                  : exp.amount * exchangeRate

                subAmountLabel = `(${exp.amount.toLocaleString()} ${exp.currency})`
              }

              const mainLabel = currency === 'CAD'
                ? `$${mainAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `${Math.round(mainAmount).toLocaleString()}원`

              return (
                <ExpenseItem key={exp.id} onClick={(e) => handleDeleteClick(exp.id, e)}>
                  <LeftSection>
                    <IconCircle>
                      {getCategoryIcon(exp.category)}
                    </IconCircle>
                    <TextInfo>
                      <CategoryTitle>{exp.category}</CategoryTitle>
                      <Subtitle>{exp.note || `${format(parseISO(exp.date), 'HH:mm')} 결제`}</Subtitle>
                      {exp.tags && exp.tags.length > 0 && (
                        <TagsContainer>
                          {exp.tags.map((tag, idx) => (
                            <TagBadge key={idx}>#{tag}</TagBadge>
                          ))}
                        </TagsContainer>
                      )}
                    </TextInfo>
                  </LeftSection>
                  <RightSection>
                    <AmountMain>{mainLabel}</AmountMain>
                    <AmountSub>{subAmountLabel}</AmountSub>
                  </RightSection>
                </ExpenseItem>
              )
            })}
          </GroupContainer>
        )
      })}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="내역 삭제"
        message="정말로 이 내역을 삭제하시겠습니까?"
      />
    </ListContainer>
  )
}
