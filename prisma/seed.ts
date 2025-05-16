import process from 'node:process'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('admin123', 12)

  await prisma.user.upsert({
    where: { email: 'admin@prohelen.com' },
    update: {
      password,
    },
    create: {
      email: 'admin@prohelen.com',
      name: 'Admin',
      password,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
