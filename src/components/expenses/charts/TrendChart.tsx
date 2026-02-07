'use client'

import React from 'react'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useExpenseContext } from '@/contexts/ExpenseContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { format, startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns'

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`

export default function TrendChart() {
    const { expenses } = useExpenseContext()
    const { convert, currency } = useCurrency()

    const today = new Date()
    const start = startOfMonth(today)
    const end = endOfMonth(today)

    // Generate all days in current month
    const days = eachDayOfInterval({ start, end })

    const data = days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const dailyExpenses = expenses.filter(e => e.date === dateStr)
        const total = dailyExpenses.reduce((sum, e) => sum + convert(e.amount, e.currency, currency), 0)

        return {
            date: format(day, 'd'), // Just day number
            amount: total,
            fullDate: dateStr
        }
    })

    return (
        <ChartWrapper>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Monthly Trend ({format(today, 'MMMM')})</h3>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                        formatter={(value: number | undefined) =>
                            `${currency === 'CAD' ? '$' : '₩'}${value ? value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}`
                        }
                        labelFormatter={(label) => `Day ${label}`}
                    />
                    <Bar dataKey="amount" fill="#00C896" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartWrapper>
    )
}
