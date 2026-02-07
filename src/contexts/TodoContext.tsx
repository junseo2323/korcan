'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export interface TodoItem {
    id: string
    text: string
    completed: boolean
    date: string // YYYY-MM-DD
    color?: string
}

export interface TodoContextType {
    todos: TodoItem[]
    addTodo: (text: string, date: string, color?: string) => void
    toggleTodo: (id: string) => void
    deleteTodo: (id: string) => void
    getTodosByDate: (date: string) => TodoItem[]
    fetchTodos: (startDate: string, endDate: string) => void
    loadTodosForMonth: (year: number, month: number) => void
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: React.ReactNode }) {
    const [todos, setTodos] = useState<TodoItem[]>([])

    // Helper to format date consistent with API
    const formatDate = (dateStr: string) => dateStr.split('T')[0]

    const fetchTodos = async (startDate: string, endDate: string) => {
        try {
            const res = await fetch(`/api/todos?startDate=${startDate}&endDate=${endDate}`)
            if (res.ok) {
                const data = await res.json()
                const formatted = data.map((t: any) => ({
                    id: t.id,
                    text: t.text,
                    completed: t.isCompleted, // DB field is isCompleted
                    date: formatDate(t.date),
                    color: t.tagColor // DB field is tagColor
                }))
                // Merge with existing todos or replace? 
                // Replacing is safer for consistency, but we might overwrite if fetching ranges overlap.
                // Or just use a map to deduplicate.
                setTodos(formatted)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const loadTodosForMonth = (year: number, month: number) => {
        // month is 0-indexed in JS Date? 
        // Let's assume passed month is 1-12 for simplicity or check usage.
        // Usually Date object uses 0-11.
        // Let's assume 1-12 for now or match usage.

        // Calculate start and end of month
        const start = new Date(year, month - 1, 1)
        const end = new Date(year, month, 0) // Last day of month

        const startStr = start.toISOString().split('T')[0]
        const endStr = end.toISOString().split('T')[0]

        fetchTodos(startStr, endStr)
    }

    // Initial load? Maybe load current month?
    useEffect(() => {
        const now = new Date()
        loadTodosForMonth(now.getFullYear(), now.getMonth() + 1)
    }, [])

    const addTodo = async (text: string, date: string, color: string = '#4F85F8') => {
        const tempId = crypto.randomUUID()
        const newTodo: TodoItem = {
            id: tempId,
            text,
            completed: false,
            date,
            color
        }
        setTodos(prev => [...prev, newTodo])

        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, date, tagColor: color })
            })
            if (res.ok) {
                const saved = await res.json()
                setTodos(prev => prev.map(t => t.id === tempId ? {
                    ...t,
                    id: saved.id,
                    date: formatDate(saved.date),
                    color: saved.tagColor
                } : t))
            }
        } catch (e) {
            console.error(e)
        }
    }

    const toggleTodo = async (id: string) => {
        const todo = todos.find(t => t.id === id)
        if (!todo) return

        const newStatus = !todo.completed

        // Optimistic
        setTodos(prev => prev.map(t =>
            t.id === id ? { ...t, completed: newStatus } : t
        ))

        try {
            await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCompleted: newStatus })
            })
        } catch (e) {
            console.error(e)
            // Rollback
            setTodos(prev => prev.map(t =>
                t.id === id ? { ...t, completed: !newStatus } : t
            ))
        }
    }

    const deleteTodo = async (id: string) => {
        setTodos(prev => prev.filter(todo => todo.id !== id))
        try {
            await fetch(`/api/todos/${id}`, { method: 'DELETE' })
        } catch (e) {
            console.error(e)
        }
    }

    const getTodosByDate = (date: string) => {
        return todos.filter(todo => todo.date === date)
    }

    return (
        <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, getTodosByDate, fetchTodos, loadTodosForMonth }}>
            {children}
        </TodoContext.Provider>
    )
}

export function useTodo() {
    const context = useContext(TodoContext)
    if (context === undefined) {
        throw new Error('useTodo must be used within a TodoProvider')
    }
    return context
}
