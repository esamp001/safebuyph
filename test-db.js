const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function createUser() {
  try {
    // Testing a simple query
    const users = await prisma.transaction.create({
      data: {
        status: 'pending',
        buyer: {
          connect: { id: 1 }, // Connect to user with ID 1
        },
        seller: {
          connect: { id: 2 }, // Connect to seller with ID 2
        },
      },
    });
    console.log('Transaction Created:', transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
