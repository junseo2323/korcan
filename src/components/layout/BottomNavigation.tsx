'use client'

import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PieChart, Calendar, Users, ShoppingBag } from 'lucide-react'

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px; /* Reduced specific height */
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom); /* iOS safe area */
  z-index: 1000;
`

const NavItem = styled(Link) <{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text.secondary};
  font-size: 10px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  transition: color 0.2s;
  padding: 8px 0;
  width: 100%;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export default function BottomNavigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: '홈', icon: Home },
    { href: '/expenses', label: '가계부', icon: PieChart },
    { href: '/calendar', label: '캘린더', icon: Calendar },
    { href: '/community', label: '게시판', icon: Users },
    { href: '/market', label: '장터', icon: ShoppingBag },
  ]

  const isActive = (href: string) => {
    if (href === '/market') {
      return pathname.startsWith('/market') || pathname.startsWith('/real-estate')
    }
    return pathname === href
  }

  return (
    <NavContainer>
      {links.map(({ href, label, icon: Icon }) => {
        const active = isActive(href)
        return (
          <NavItem key={href} href={href} $active={active}>
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
          </NavItem>
        )
      })}
    </NavContainer>
  )
}
