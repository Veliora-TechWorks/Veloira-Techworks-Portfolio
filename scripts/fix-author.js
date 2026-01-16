const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // First, check if user exists
  let user = await prisma.user.findUnique({
    where: { email: 'velioratechworks@gmail.com' }
  })
  
  if (!user) {
    // Create user if doesn't exist
    const hashedPassword = await bcrypt.hash('Veliora@2025', 10)
    user = await prisma.user.create({
      data: {
        email: 'velioratechworks@gmail.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    console.log('✅ User created:', user.id)
  } else {
    console.log('✅ User found:', user.id)
  }
  
  console.log('\n📋 Copy this command and run in browser console (F12):')
  console.log(`localStorage.setItem('authorId', '${user.id}')`)
  console.log('\nThen refresh the page and try creating the project again.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
