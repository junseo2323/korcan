
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const targetName = '서준' // User name to grant admin
    const adminEmail = 'admin@korcan.cc' // Make sure the original admin also has role

    console.log(`Granting ADMIN role to user: ${targetName}`)

    // 1. Grant to '서준'
    try {
        const user = await prisma.user.findFirst({
            where: { name: targetName }
        })

        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: { role: 'ADMIN' }
            })
            console.log(`✅ Granted ADMIN role to ${user.name} (${user.id})`)
        } else {
            console.log(`⚠️ User ${targetName} not found.`)
        }
    } catch (e) {
        console.error(e)
    }

    // 2. Grant to '관리자' (Just in case)
    try {
        const admin = await prisma.user.findFirst({
            where: { name: '관리자' }
        })
        if (admin) {
            await prisma.user.update({
                where: { id: admin.id },
                data: { role: 'ADMIN' }
            })
            console.log(`✅ Granted ADMIN role to ${admin.name} (${admin.id})`)
        }
    } catch (e) {
        console.error(e)
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
