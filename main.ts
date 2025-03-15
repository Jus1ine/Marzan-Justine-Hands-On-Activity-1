import { PrismaClient } from '@prisma/client'
import { log } from 'console'

// Add type declaration to help TypeScript recognize our models
declare global {
  namespace PrismaClient {
    interface PrismaClient {
      account: any;
      product: any;
    }
  }
}

const prisma = new PrismaClient() as any

async function main() {
  console.log("Starting db_act1 operations...")

  try {
    // Action 1: Create Account and Profile Together
    async function createAccountWithProfile() {
      // Add random number to email and username to avoid unique constraint errors
      const random = Math.floor(Math.random() * 10000)
      
      const accountWithProfile = await prisma.account.create({
        data: {
          email: `john.doe${random}@example.com`,
          username: `johndoe${random}`,
          password: 'securepassword',
          profile: {
            create: {
              firstname: 'John',
              lastname: 'Doe',
              middlename: 'Smith',
              bio: 'Software developer with 5+ years of experience',
              picture: 'profile.jpg'
            }
          }
        },
        include: {
          profile: true
        }
      })
      
      console.log('Created Account with Profile:')
      console.dir(accountWithProfile, { depth: null })
      return accountWithProfile
    }

    // Action 2: Add Product to an existing Account
    async function addProductToAccount(accountId: number) {
      const newProduct = await prisma.product.create({
        data: {
          name: 'Premium Subscription',
          description: 'Access to all premium features',
          price: 19.99,
          accountId: accountId
        }
      })
      
      console.log('Added Product to Account:')
      console.dir(newProduct, { depth: null })
      return newProduct
    }

    // Action 3: Fetch Accounts with their Profiles and Products
    async function fetchAccountsWithDetails() {
      const accounts = await prisma.account.findMany({
        include: {
          profile: true,
          products: true
        }
      })
      
      console.log('All Accounts with Profiles and Products:')
      console.dir(accounts, { depth: null })
      return accounts
    }

    // Execute the actions
    console.log('==== Creating Account with Profile ====')
    const newAccount = await createAccountWithProfile()
    
    console.log('\n==== Adding Product to Account ====')
    await addProductToAccount(newAccount.id)
    
    // Add another product to demonstrate multiple products
    await prisma.product.create({
      data: {
        name: 'Basic Subscription',
        description: 'Access to basic features',
        price: 9.99,
        accountId: newAccount.id
      }
    })
    
    console.log('\n==== Fetching All Accounts with Details ====')
    await fetchAccountsWithDetails()
    
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })