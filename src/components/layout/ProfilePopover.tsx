'use client'

import React from 'react'
import styled from 'styled-components'
import { LogOut, User } from 'lucide-react'
import { signOut } from 'next-auth/react'

const Container = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  width: 220px;
  overflow: hidden;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

const UserInfo = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const UserName = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
`

const UserEmail = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Menu = styled.div`
  padding: 0.5rem;
`

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
    color: ${({ theme }) => theme.colors.status.error};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

interface ProfilePopoverProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  onClose: () => void
}

export default function ProfilePopover({ user, onClose }: ProfilePopoverProps) {
  // Close when clicking outside is usually handled by the parent or a custom hook
  // For simplicity, we assume the parent toggles visibility.

  return (
    <Container>
      <UserInfo>
        <UserName>{user.name || '사용자'}</UserName>
        <UserEmail>{user.email || '이메일 없음'}</UserEmail>
      </UserInfo>
      <Menu>
        <MenuItem onClick={() => signOut()}>
          <LogOut />
          로그아웃
        </MenuItem>
      </Menu>
    </Container>
  )
}
