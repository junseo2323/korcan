import { useExpenseContext } from '@/contexts/ExpenseContext'

// Re-exporting this hook so components don't need to change imports
// It now delegates to the Context instead of creating local state
export function useExpenses() {
    return useExpenseContext()
}
