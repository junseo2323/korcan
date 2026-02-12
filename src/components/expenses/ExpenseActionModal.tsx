'use client'

import React from 'react'
import styled from 'styled-components'
import { X, Edit2, Trash2 } from 'lucide-react'

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
  z-index: 3000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.2s;
`

const ModalBox = styled.div`
  background-color: white;
  width: 90%;
  max-width: 320px;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  
  background-color: ${({ theme, $variant }) =>
        $variant === 'delete' ? theme.colors.neutral.gray100 : theme.colors.primary};
  
  color: ${({ theme, $variant }) =>
        $variant === 'delete' ? theme.colors.status.error : 'white'};

  &:last-child {
    margin-bottom: 0;
  }

  &:active {
    transform: scale(0.98);
  }
`

interface ExpenseActionModalProps {
    isOpen: boolean
    onClose: () => void
    onEdit: () => void
    onDelete: () => void
}

export default function ExpenseActionModal({
    isOpen,
    onClose,
    onEdit,
    onDelete
}: ExpenseActionModalProps) {
    if (!isOpen) return null

    return (
        <Overlay $isOpen={isOpen} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <ModalBox>
                <Header>
                    <Title>지출 내역 관리</Title>
                    <CloseButton onClick={onClose}>
                        <X size={24} />
                    </CloseButton>
                </Header>

                <ActionButton onClick={onEdit}>
                    <Edit2 size={18} />
                    수정하기
                </ActionButton>

                <ActionButton $variant="delete" onClick={onDelete}>
                    <Trash2 size={18} />
                    삭제하기
                </ActionButton>
            </ModalBox>
        </Overlay>
    )
}
