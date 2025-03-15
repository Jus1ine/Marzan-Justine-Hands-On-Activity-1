import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() as any

async function retrieveData() {
  try {
    // Retrieve data: Fetch accounts with profiles and products
    const accounts = await prisma.account.findMany({
      include: {
        profile: true,
        products: true
      }
    })
    
    console.log('All Accounts with Profiles and Products:')
    console.dir(accounts, { depth: null })
    return accounts
  } catch (error) {
    console.error('Error retrieving data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the retrieve function
retrieveData() 