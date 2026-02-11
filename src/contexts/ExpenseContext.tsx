'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface Expense {
    id: string
    amount: number
    currency: 'CAD' | 'KRW'
    category: string
    date: string
    note: string
    tags?: string[]
}

export interface RecurringRule {
    id: string
    category: string
    amount: number
    currency: 'CAD' | 'KRW'
    note: string
    frequency: 'monthly' | 'weekly'
    day: number // 1-31 (Month), 0-6 (Week, 0=Sun)
}

interface ExpenseContextType {
    expenses: Expense[]
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
    removeExpense: (id: string) => Promise<void>
    recurringRules: RecurringRule[]
    addRecurringRule: (rule: Omit<RecurringRule, 'id'>) => Promise<void>
    removeRecurringRule: (id: string) => Promise<void>
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
    const [expenses, setExpenses] = React.useState<Expense[]>([])
    const [recurringRules, setRecurringRules] = React.useState<RecurringRule[]>([])

    // Fetch Expenses & Rules on Load
    useEffect(() => {
        const loadData = async () => {
            try {
                const [expRes, ruleRes] = await Promise.all([
                    fetch('/api/expenses'),
                    fetch('/api/expenses/recurring')
                ])

                if (expRes.ok) {
                    const data = await expRes.json()
                    if (Array.isArray(data)) {
                        const formatted = data.map((e: any) => ({
                            ...e,
                            date: e.date.split('T')[0]
                        }))
                        setExpenses(formatted)
                    }
                }

                if (ruleRes.ok) {
                    const data = await ruleRes.json()
                    if (Array.isArray(data)) {
                        setRecurringRules(data)
                    }
                }
            } catch (err) {
                console.error('Failed to load data:', err)
            }
        }
        loadData()
    }, [])

    const addExpense = async (expense: Omit<Expense, 'id'>) => {
        const tempId = uuidv4()
        const newExpense = { ...expense, id: tempId }
        setExpenses((prev) => [newExpense, ...prev])

        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense)
            })

            if (!res.ok) throw new Error('Failed to save')

            const savedExpense = await res.json()
            setExpenses(prev => prev.map(e => e.id === tempId ? { ...savedExpense, date: savedExpense.date.split('T')[0] } : e))
        } catch (error) {
            console.error(error)
            setExpenses(prev => prev.filter(e => e.id !== tempId))
            alert('Failed to save expense')
        }
    }

    const removeExpense = async (id: string) => {
        const prevExpenses = [...expenses]
        setExpenses((prev) => prev.filter((exp) => exp.id !== id))

        try {
            const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete')
        } catch (error) {
            console.error(error)
            setExpenses(prevExpenses)
            alert('Failed to delete expense')
        }
    }

    const addRecurringRule = async (rule: Omit<RecurringRule, 'id'>) => {
        const tempId = uuidv4()
        const newRule = { ...rule, id: tempId } // userId handled by server
        setRecurringRules((prev) => [...prev, newRule])

        try {
            const res = await fetch('/api/expenses/recurring', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rule)
            })

            if (!res.ok) throw new Error('Failed to save rule')

            const savedRule = await res.json()
            setRecurringRules(prev => prev.map(r => r.id === tempId ? savedRule : r))

            // Trigger auto-check immediately after adding a rule? 
            // The effect depends on recurringRules, so it should trigger automatically.
        } catch (error) {
            console.error(error)
            setRecurringRules(prev => prev.filter(r => r.id !== tempId))
            alert('Failed to save recurring rule')
        }
    }

    const removeRecurringRule = async (id: string) => {
        const prevRules = [...recurringRules]
        setRecurringRules((prev) => prev.filter((r) => r.id !== id))

        try {
            const res = await fetch(`/api/expenses/recurring/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete rule')
        } catch (error) {
            console.error(error)
            setRecurringRules(prevRules)
            alert('Failed to delete rule')
        }
    }

    // Auto-generation Logic
    useEffect(() => {
        if (recurringRules.length === 0) return
        if (expenses.length === 0) return

        const today = new Date()
        const todayDateStr = today.toISOString().split('T')[0]
        const currentDay = today.getDate()
        const currentWeekDay = today.getDay()

        let hasUpdates = false
        const newExpensesToPost: Omit<Expense, 'id'>[] = []

        recurringRules.forEach(rule => {
            if (rule.id.length > 30 && !rule.id.includes('-')) return

            let shouldRun = false
            if (rule.frequency === 'monthly' && rule.day === currentDay) shouldRun = true
            if (rule.frequency === 'weekly' && rule.day === currentWeekDay) shouldRun = true

            if (shouldRun) {
                const alreadyExists = expenses.some(e =>
                    e.date === todayDateStr &&
                    e.amount === rule.amount &&
                    e.note === rule.note &&
                    e.currency === rule.currency
                )

                if (!alreadyExists) {
                    newExpensesToPost.push({
                        amount: rule.amount,
                        currency: rule.currency as 'CAD' | 'KRW',
                        category: rule.category,
                        date: todayDateStr,
                        note: rule.note || '',
                        tags: ['recurring']
                    })
                    hasUpdates = true
                }
            }
        })

        if (hasUpdates) {
            newExpensesToPost.forEach(exp => addExpense(exp))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recurringRules, expenses])

    return (
        <ExpenseContext.Provider value={{
            expenses,
            addExpense,
            removeExpense,
            recurringRules,
            addRecurringRule,
            removeRecurringRule
        }}>
            {children}
        </ExpenseContext.Provider>
    )
}

export function useExpenseContext() {
    const context = useContext(ExpenseContext)
    if (context === undefined) {
        throw new Error('useExpenseContext must be used within an ExpenseProvider')
    }
    return context
}
