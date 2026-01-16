const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'velioratechworks@gmail.com' }
  })
  
  if (user) {
    console.log('Found user:')
    console.log('ID:', user.id)
    console.log('Email:', user.email)
    console.log('Name:', user.name)
    console.log('\nUse this ID when creating projects!')
  } else {
    console.log('No user found with email: velioratechworks@gmail.com')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
