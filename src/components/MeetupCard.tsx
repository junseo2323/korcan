'use client'

import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { Calendar, Users, MapPin } from 'lucide-react'
import { format } from 'date-fns'

interface MeetupCardProps {
  post: any
}

const Card = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  }
`

const ImageSection = styled.div<{ $gradient: string }>`
  height: 160px;
  background: ${({ $gradient }) => $gradient};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`

const MeetupTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  line-height: 1.3;
  word-break: keep-all;
`

const StatusBadge = styled.div<{ $status: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${({ $status }) => $status === 'OPEN' ? '#10b981' : '#6b7280'};
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const ContentSection = styled.div`
  padding: 1.25rem;
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`

const InfoText = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const MemberCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
  margin-top: 0.5rem;
`

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.disabled};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const OrganizerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
`

// Gradient color presets for visual cards
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
]

export default function MeetupCard({ post }: MeetupCardProps) {
  const router = useRouter()
  const meetup = post.meetup

  if (!meetup) return null

  // Select gradient based on meetup ID
  const gradientIndex = parseInt(meetup.id.slice(-1), 16) % gradients.length
  const gradient = gradients[gradientIndex]

  const handleClick = () => {
    router.push(`/community/${post.id}`)
  }

  return (
    <Card onClick={handleClick}>
      <ImageSection $gradient={gradient}>
        <MeetupTitle>{post.title}</MeetupTitle>
        <StatusBadge $status={meetup.status}>
          {meetup.status === 'OPEN' ? '모집중' : '마감'}
        </StatusBadge>
      </ImageSection>

      <ContentSection>
        <InfoRow>
          <Calendar size={16} />
          <InfoText>
            {format(new Date(meetup.date), 'yyyy년 M월 d일 HH:mm')}
          </InfoText>
        </InfoRow>

        <InfoRow>
          <MapPin size={16} />
          <InfoText>{meetup.region}</InfoText>
        </InfoRow>

        <MemberCount>
          <MemberInfo>
            <Users size={16} />
            <span>{meetup.currentMembers} / {meetup.maxMembers}명</span>
          </MemberInfo>
          <OrganizerInfo>
            {post.user?.name || '익명'}
          </OrganizerInfo>
        </MemberCount>
      </ContentSection>
    </Card>
  )
}
