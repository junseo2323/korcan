import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Deleting all users...")
        const { count } = await prisma.user.deleteMany()
        console.log(`Deleted ${count} users.`)
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
