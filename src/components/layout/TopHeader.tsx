'use client'

import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Bell, User, MessageCircle } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import ProfilePopover from './ProfilePopover'

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
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 1000;
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
  const { togglePopup } = useChat()
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

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
      <Logo>KorCan</Logo>
      <RightSection>
        {session && (
          <IconButton onClick={togglePopup} aria-label="Chat">
            <MessageCircle size={24} strokeWidth={1.5} />
          </IconButton>
        )}

        {session ? (
          <PopoverWrapper ref={profileRef}>
            <IconButton onClick={() => setShowProfile(!showProfile)} aria-label="Profile">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  style={{ width: 28, height: 28, borderRadius: '50%' }}
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
            onClick={() => signIn('kakao')}
            style={{
              backgroundColor: '#FEE500',
              color: '#000000',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            카카오 로그인
          </button>
        )}
      </RightSection>
    </HeaderContainer>
  )
}
