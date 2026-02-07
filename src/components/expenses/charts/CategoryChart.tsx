'use client'

import React from 'react'
import styled from 'styled-components'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useExpenseContext } from '@/contexts/ExpenseContext'
import { useCurrency } from '@/contexts/CurrencyContext'

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  padding: 1rem;
`

const COLORS = ['#6200EE', '#03DAC6', '#B00020', '#FFBB28', '#FF8042', '#0088FE', '#00C49F']

export default function CategoryChart() {
    const { expenses } = useExpenseContext()
    const { convert, currency } = useCurrency()

    const data = expenses.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.category)
        const convertedAmount = convert(curr.amount, curr.currency, currency)

        if (existing) {
            existing.value += convertedAmount
        } else {
            acc.push({ name: curr.category, value: convertedAmount })
        }
        return acc
    }, [] as { name: string; value: number }[])

    if (data.length === 0) {
        return (
            <ChartWrapper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ opacity: 0.5 }}>No data to display</p>
            </ChartWrapper>
        )
    }

    return (
        <ChartWrapper>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Spending by Category</h3>
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number | undefined) =>
                            `${currency === 'CAD' ? '$' : '₩'}${value ? value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}`
                        }
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartWrapper>
    )
}
