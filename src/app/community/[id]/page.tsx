
import React from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PostClient from './PostClient'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const id = (await params).id

  // Unhandled edge case: invalid ID logic, but Prisma will return null for findUnique
  const post = await prisma.post.findUnique({
    where: { id },
    select: { title: true, content: true, images: true }
  })

  if (!post) {
    return {
      title: '게시글을 찾을 수 없습니다',
      description: '존재하지 않는 게시글입니다.'
    }
  }

  const imageUrl = post.images && post.images.length > 0 ? post.images[0].url : undefined

  return {
    title: post.title,
    description: post.content.slice(0, 160).replace(/\n/g, ' '),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160).replace(/\n/g, ' '),
      images: imageUrl ? [imageUrl] : [],
      type: 'article',
    }
  }
}


export default async function PostDetailPage({ params }: Props) {
  const id = (await params).id
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      images: true,
      user: { select: { name: true } }
    }
  })

  // If post missing, Client component handles 404 UI or we can return null here
  if (!post) return <PostClient />

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.user?.name || 'Anonymous',
    },
    image: post.images?.map(img => img.url) || [],
    description: post.content.slice(0, 160).replace(/\n/g, ' '),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://korcan.cc',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Community',
        item: 'https://korcan.cc/community',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://korcan.cc/community/${id}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <PostClient />
    </>
  )
}
