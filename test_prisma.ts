const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Checking ChatRoom model...')
    if (prisma.chatRoom) {
        const count = await prisma.chatRoom.count()
        console.log('ChatRoom count:', count)
        console.log('Success: ChatRoom model exists.')
    } else {
        console.error('Error: prisma.chatRoom is undefined.')
        process.exit(1)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
