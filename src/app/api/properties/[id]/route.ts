import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params
        const id = params.id

        // In Next.js 15+ or latest 13 generic: params is a Promise in some versions, or object.
        // In strict TS it might complain. 
        // safe way: 
        // const { id } = params

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
