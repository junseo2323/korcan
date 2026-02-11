import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const posts = await prisma.post.findMany({
        select: { category: true },
        distinct: ['category']
    })

    const categories = posts.map(p => p.category)
    return NextResponse.json(categories)
}
