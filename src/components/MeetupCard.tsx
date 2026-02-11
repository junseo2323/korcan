'use client'

import React from 'react'
import styled from 'styled-components'
import { Calendar, Users, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Card = styled.div`
  background-color: white;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.1s;
  border: 1px solid #e5e7eb;
  
  &:active { transform: scale(0.98); }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`

const Badge = styled.span`
  font-size: 0.75rem;
  color: white;
  background-color: #ec4899;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
`

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`

const InfoRow = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #4b5563;
  margin-bottom: 1rem;
  align-items: center;
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const StatusBadge = styled.span<{ status: string }>`
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  background-color: ${({ status }) => status === 'OPEN' ? '#dbf4ff' : '#f3f4f6'};
  color: ${({ status }) => status === 'OPEN' ? '#1e40af' : '#4b5563'};
`

interface MeetupCardProps {
    post: any
}

export default function MeetupCard({ post }: MeetupCardProps) {
    const router = useRouter()
    const meetup = post.meetup

    if (!meetup) return null

    return (
        <Card onClick={() => router.push(`/community/${post.id}`)}>
            <Header>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Badge>모임</Badge>
                    <StatusBadge status={meetup.status}>{meetup.status === 'OPEN' ? '모집중' : '마감'}</StatusBadge>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
            </Header>
            <Title>{post.title}</Title>

            <InfoRow>
                <InfoItem>
                    <Calendar size={16} />
                    {new Date(meetup.date).toLocaleDateString()}
                </InfoItem>
                <InfoItem>
                    <Users size={16} />
                    {meetup.currentMembers}/{meetup.maxMembers}명
                </InfoItem>
                <InfoItem>
                    <MapPin size={16} />
                    {meetup.region}
                </InfoItem>
            </InfoRow>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
                <img
                    src={post.user?.image || '/placeholder-user.png'}
                    alt="profile"
                    style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                />
                <span>{post.user?.name || 'Organizer'}</span>
            </div>
        </Card>
    )
}
