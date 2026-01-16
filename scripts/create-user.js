const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Veliora@2025', 10)
  
  const user = await prisma.user.upsert({
    where: { id: 'cmkgmy9fb00005bxww5y0n9kj' },
    update: {},
    create: {
      id: 'cmkgmy9fb00005bxww5y0n9kj',
      email: 'velioratechworks@gmail.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })
  
  console.log('User created:', user)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
