'use client'

import React from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'
import ExpenseForm from './ExpenseForm'
import { Expense } from '@/contexts/ExpenseContext'

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 3100; /* Higher than ActionModal */
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.2s;
`

const ModalBox = styled.div`
  background-color: white;
  width: 95%;
  max-width: 500px;
  border-radius: 16px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
  color: #666;
`

interface EditExpenseModalProps {
    isOpen: boolean
    onClose: () => void
    expense: Expense | null
    onUpdate: (data: any) => Promise<void>
}

export default function EditExpenseModal({ isOpen, onClose, expense, onUpdate }: EditExpenseModalProps) {
    if (!isOpen || !expense) return null

    return (
        <Overlay $isOpen={isOpen} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <ModalBox>
                <CloseButton onClick={onClose}>
                    <X size={24} />
                </CloseButton>
                {/* Reuse ExpenseForm but customized via props */}
                <ExpenseForm
                    initialData={expense}
                    onSubmit={async (data) => {
                        await onUpdate(data)
                        onClose()
                    }}
                    onCancel={onClose}
                />
            </ModalBox>
        </Overlay>
    )
}
