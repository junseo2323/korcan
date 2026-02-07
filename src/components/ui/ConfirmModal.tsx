'use client'

import React from 'react'
import styled from 'styled-components'

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
  text-align: center;
`

const Title = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Message = styled.p`
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`

const Button = styled.button<{ $variant?: 'primary' | 'cancel' }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  
  background-color: ${({ theme, $variant }) =>
        $variant === 'cancel' ? theme.colors.neutral.gray200 : theme.colors.status.error};
  
  color: ${({ theme, $variant }) =>
        $variant === 'cancel' ? theme.colors.text.primary : 'white'};

  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message?: string
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.'
}: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <Overlay $isOpen={isOpen} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <ModalBox>
                <Title>{title}</Title>
                <Message>{message}</Message>
                <ButtonGroup>
                    <Button $variant="cancel" onClick={onClose}>취소</Button>
                    <Button $variant="primary" onClick={onConfirm}>삭제</Button>
                </ButtonGroup>
            </ModalBox>
        </Overlay>
    )
}
