'use client'

import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { User, MessageCircle, Home, PieChart, Calendar, Users, ShoppingBag, Search } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import ProfilePopover from './ProfilePopover'
import NotificationBell from './NotificationBell'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  z-index: 1000;
`

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
`

const DesktopNavContainer = styled.nav`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
`

const NavItem = styled(Link) <{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text.secondary};
  font-size: 0.95rem;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.5px;
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const IconButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
  }
`

const PopoverWrapper = styled.div`
    position: relative;
`

import { useChat } from '@/contexts/ChatContext'

export default function TopHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { togglePopup } = useChat()
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

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
    if (href === '/community') {
      return pathname.startsWith('/community')
    }
    return pathname === href
  }

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  return (
    <HeaderContainer>
      <HeaderInner>
        <Logo>KorCan</Logo>

        <DesktopNavContainer>
          {(session ? links : links.filter(l => l.href === '/community' || l.href === '/market')).map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <NavItem key={href} href={href} $active={active}>
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </NavItem>
            )
          })}
        </DesktopNavContainer>

        <RightSection>
          <Link href="/search" aria-label="검색" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%', color: 'inherit' }}>
            <Search size={22} strokeWidth={1.5} />
          </Link>
          {session && <NotificationBell />}
          {session && (
            <IconButton onClick={togglePopup} aria-label="Chat">
              <MessageCircle size={24} strokeWidth={1.5} />
            </IconButton>
          )}

          {session ? (
            <PopoverWrapper ref={profileRef}>
              <IconButton onClick={() => setShowProfile(!showProfile)} aria-label="Profile">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="프로필"
                    width={28}
                    height={28}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={24} strokeWidth={1.5} />
                )}
              </IconButton>
              {showProfile && (
                <ProfilePopover
                  user={session.user || {}}
                  onClose={() => setShowProfile(false)}
                />
              )}
            </PopoverWrapper>
          ) : (
            <button
              onClick={() => router.push('/login')}
              style={{
                backgroundColor: '#3B82F6',
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              로그인
            </button>
          )}
        </RightSection>
      </HeaderInner>
    </HeaderContainer>
  )
}
