'use client'

import React from 'react'
import styled from 'styled-components'
import { LogOut, Heart } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

const Container = styled.div`
  position: fixed;
  top: 60px;
  right: 0.5rem;
  width: 220px;
  max-width: calc(100vw - 1rem);
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
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

const menuItemStyle = `
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  text-decoration: none;
  svg { width: 18px; height: 18px; }
`

const MenuItem = styled.button`
  ${menuItemStyle}
  color: ${({ theme }) => theme.colors.text.primary};
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
    color: ${({ theme }) => theme.colors.status.error};
  }
`

const MenuLink = styled(Link)`
  ${menuItemStyle}
  color: ${({ theme }) => theme.colors.text.primary};
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
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
        <MenuLink href="/my/likes" onClick={onClose}>
          <Heart size={18} />
          찜한 매물
        </MenuLink>
        <MenuItem onClick={() => signOut()}>
          <LogOut />
          로그아웃
        </MenuItem>
      </Menu>
    </Container>
  )
}
