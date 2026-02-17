
import React from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductClient from './ProductClient'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const id = (await params).id

  const product = await prisma.product.findUnique({
    where: { id },
    select: { title: true, description: true, imageUrl: true }
  })

  if (!product) {
    return {
      title: '상품을 찾을 수 없습니다',
      description: '존재하지 않는 상품입니다.'
    }
  }

  return {
    title: product.title,
    description: product.description.slice(0, 160).replace(/\n/g, ' '),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160).replace(/\n/g, ' '),
      images: product.imageUrl ? [product.imageUrl] : [],
      type: 'website',
    }
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const id = (await params).id
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      imageUrl: true,
      price: true,
      // currency: true, // Removed as it does not exist on Product model
      createdAt: true,
      updatedAt: true,
      status: true,
      seller: { select: { name: true } }
    }
  })

  if (!product) return <ProductClient />

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.imageUrl ? [product.imageUrl] : [],
    description: product.description.slice(0, 160).replace(/\n/g, ' '),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CAD', // Defaulting to CAD as per context
      price: product.price,
      availability: product.status === 'SELLING' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      seller: {
        '@type': 'Person',
        name: product.seller?.name || 'Anonymous'
      }
    }
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
        name: 'Market',
        item: 'https://korcan.cc/market',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `https://korcan.cc/market/${id}`,
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
      <ProductClient />
    </>
  )
}
