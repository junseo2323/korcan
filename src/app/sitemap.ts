
export const dynamic = 'force-dynamic'

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://korcan.cc'

    // 1. Static Routes
    const routes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date('2026-01-01'), changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/community`, lastModified: new Date('2026-01-01'), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/market`, lastModified: new Date('2026-01-01'), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/real-estate`, lastModified: new Date('2026-01-01'), changeFrequency: 'daily', priority: 0.9 },
    ]

    // 2. Dynamic Posts (Community)
    const posts = await prisma.post.findMany({
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 1000,
    })

    const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/community/${post.id}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // 3. Dynamic Products (Market)
    const products = await prisma.product.findMany({
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 1000,
    })

    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/market/${product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // 4. Dynamic Properties (Real Estate)
    const properties = await prisma.property.findMany({
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 1000,
    })

    const propertyRoutes = properties.map((property) => ({
        url: `${baseUrl}/real-estate/${property.id}`,
        lastModified: property.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...postRoutes, ...productRoutes, ...propertyRoutes]
}
