
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    console.log('Admin User:', admin)

    const supportersPost = await prisma.post.findFirst({
        where: {
            title: { contains: 'KorCan 서포터즈' }
        },
        include: { user: true }
    })
    console.log('Supporters Post:', supportersPost)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
