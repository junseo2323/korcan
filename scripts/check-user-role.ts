
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const userName = '서준'
    const user = await prisma.user.findFirst({
        where: { name: userName }
    })

    if (user) {
        console.log(`User: ${user.name}`)
        console.log(`ID: ${user.id}`)
        console.log(`Role: ${user.role}`)
    } else {
        console.log(`User ${userName} not found.`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
