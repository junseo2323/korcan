import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/properties
// Query params: region, type, minPrice, maxPrice, bounds (swLat,swLng,neLat,neLng)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region')
    const type = searchParams.get('type')
    const swLat = searchParams.get('swLat')
    const swLng = searchParams.get('swLng')
    const neLat = searchParams.get('neLat')
    const neLng = searchParams.get('neLng')

    const where: any = {
        status: 'AVAILABLE', // Only show available by default
    }

    if (region && region !== 'All') {
        where.region = region
        // If Global/All, we might need different logic, but assuming precise match for now or handled by frontend passing specific region
    }

    if (type && type !== 'All') {
        where.type = type
    }

    // Map Bounds Filtering
    if (swLat && swLng && neLat && neLng) {
        where.latitude = {
            gte: parseFloat(swLat),
            lte: parseFloat(neLat),
        }
        where.longitude = {
            gte: parseFloat(swLng),
            lte: parseFloat(neLng),
        }
    }

    try {
        const properties = await prisma.property.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                images: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                _count: {
                    select: { likes: true }
                }
            },
        })

        return NextResponse.json(properties)
    } catch (error) {
        console.error('Failed to fetch properties:', error)
        return NextResponse.json(
            { error: 'Failed to fetch properties' },
            { status: 500 }
        )
    }
}

// POST /api/properties
export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const {
            title,
            description,
            price,
            currency,
            period,
            type,
            bedrooms,
            bathrooms,
            address,
            latitude,
            longitude,
            region,
            features,
            images
        } = body

        // Validation could be added here

        const property = await prisma.property.create({
            data: {
                title,
                description,
                price,
                currency,
                period,
                type,
                bedrooms,
                bathrooms,
                address,
                latitude,
                longitude,
                region,
                features: Array.isArray(features) ? features.join(',') : features,
                userId: session.user.id,
                images: {
                    create: images.map((url: string) => ({ url }))
                }
            },
        })

        return NextResponse.json(property)
    } catch (error) {
        console.error('Failed to create property:', error)
        return NextResponse.json(
            { error: 'Failed to create property' },
            { status: 500 }
        )
    }
}
