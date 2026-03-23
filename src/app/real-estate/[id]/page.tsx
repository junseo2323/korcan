
import React from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PropertyClient from './PropertyClient'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const id = (await params).id

  const property = await prisma.property.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      images: { select: { url: true }, take: 1 },
    },
  })

  if (!property) {
    return {
      title: '매물을 찾을 수 없습니다',
      description: '존재하지 않는 매물입니다.',
    }
  }

  const imageUrl = property.images?.[0]?.url ?? 'https://korcan.cc/opengraph-image'
  const description = property.description.slice(0, 160).replace(/\n/g, ' ')

  return {
    title: property.title,
    description,
    alternates: { canonical: `https://korcan.cc/real-estate/${id}` },
    openGraph: {
      title: property.title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const id = (await params).id

  const property = await prisma.property.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      price: true,
      currency: true,
      address: true,
      images: { select: { url: true }, take: 1 },
    },
  })

  if (!property) return <PropertyClient />

  const imageUrl = property.images?.[0]?.url

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description.slice(0, 160).replace(/\n/g, ' '),
    image: imageUrl ? [imageUrl] : [],
    offers: {
      '@type': 'Offer',
      priceCurrency: property.currency || 'CAD',
      price: property.price,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
    },
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
        name: 'Real Estate',
        item: 'https://korcan.cc/real-estate',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: property.title,
        item: `https://korcan.cc/real-estate/${id}`,
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
      <PropertyClient />
    </>
  )
}
