'use client'

import styled from 'styled-components'
import { Plus } from 'lucide-react'

const FabContainer = styled.button`
  position: fixed;
  bottom: 80px; /* Above BottomNav */
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1001;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: ${({ theme }) => theme.colors.primaryStrong};
  }
  
  &:active {
    transform: scale(0.95);
  }
`

interface FabProps {
    onClick: () => void
}

export default function FloatingActionButton({ onClick }: FabProps) {
    return (
        <FabContainer onClick={onClick} aria-label="Add Expense">
            <Plus size={32} />
        </FabContainer>
    )
}
