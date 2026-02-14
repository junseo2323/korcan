'use client'

import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users } from 'lucide-react'
import { format } from 'date-fns'

const Container = styled.div`
  margin-bottom: 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
`

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`

const ViewAll = styled.button`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: none;
  border: none;
  cursor: pointer;
`

const ScrollContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
  
  &::-webkit-scrollbar {
    display: none;
  }
`

const Card = styled.div`
  flex: 0 0 240px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  scroll-snap-align: start;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
`

interface Meetup {
    id: string
    title: string
    date: string
    region: string
    currentMembers: number
    maxMembers: number
}

export default function MeetupRecommendationBlock({ meetups }: { meetups: Meetup[] }) {
    const router = useRouter()

    if (!meetups || meetups.length === 0) return null

    return (
        <Container>
            <Header>
                <Title>이번 주 인기 모임 🔥</Title>
                <ViewAll onClick={() => router.push('/community?tab=MEETUP')}>전체보기</ViewAll>
            </Header>
            <ScrollContainer>
                {meetups.map(meetup => (
                    <Card key={meetup.id} onClick={() => router.push('/community?tab=MEETUP')}>
                        <CardTitle>{meetup.title}</CardTitle>
                        <InfoRow>
                            <Calendar size={14} />
                            {new Date(meetup.date).toLocaleDateString()}
                        </InfoRow>
                        <InfoRow>
                            <MapPin size={14} />
                            {meetup.region}
                        </InfoRow>
                        <InfoRow>
                            <Users size={14} />
                            {meetup.currentMembers} / {meetup.maxMembers}명 참여 중
                        </InfoRow>
                    </Card>
                ))}
            </ScrollContainer>
        </Container>
    )
}
