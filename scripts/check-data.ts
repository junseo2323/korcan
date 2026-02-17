
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const notices = await prisma.post.findMany({ where: { category: '공지' } })
    console.log('Notices:', notices)
    const count = await prisma.post.count()
    console.log('Total Posts:', count)

    const likes = await prisma.like.findMany()
    console.log('Total Likes:', likes.length)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
