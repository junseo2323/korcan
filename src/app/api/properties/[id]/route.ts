import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params
        const id = params.id

        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                images: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                }
            }
        })

        if (!property) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        return NextResponse.json(property)
    } catch (error) {
        console.error('Fetch property error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await props.params
    const body = await request.json()

    const property = await prisma.property.findUnique({ where: { id } })
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (property.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    try {
        const { images, features, ...rest } = body
        const fields = {
            ...rest,
            ...(features !== undefined && { features: Array.isArray(features) ? features.join(',') : features }),
        }

        await prisma.$transaction(async (tx) => {
            await tx.property.update({ where: { id }, data: fields })

            if (images !== undefined) {
                await tx.propertyImage.deleteMany({ where: { propertyId: id } })
                if (images.length > 0) {
                    await tx.propertyImage.createMany({
                        data: images.map((url: string) => ({ url, propertyId: id }))
                    })
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update property error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await props.params

    const property = await prisma.property.findUnique({ where: { id } })
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (property.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    try {
        await prisma.property.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete property error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
