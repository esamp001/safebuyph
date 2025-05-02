const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

describe('Rating Endpoints', () => {
  let authToken;
  let testTransaction;
  let testBuyer;
  let testSeller;

  beforeAll(async () => {
    // Create test users
    testBuyer = await prisma.user.create({
      data: {
        name: 'Test Buyer',
        email: 'testbuyer@example.com',
        password: 'hashedpassword',
      },
    });

    testSeller = await prisma.user.create({
      data: {
        name: 'Test Seller',
        email: 'testseller@example.com',
        password: 'hashedpassword',
        canSell: true,
      },
    });

    // Create test transaction
    testTransaction = await prisma.transaction.create({
      data: {
        buyerId: testBuyer.id,
        sellerId: testSeller.id,
        status: 'COMPLETED',
        amount: 100,
        price: 50,
      },
    });

    // Generate auth token
    authToken = jwt.sign({ userId: testBuyer.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.rating.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('POST /ratings', () => {
    it('should create a new rating successfully', async () => {
      const response = await request(app)
        .post('/api/ratings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          transactionId: testTransaction.id,
          buyerId: testBuyer.id,
          sellerId: testSeller.id,
          score: 5,
          comment: 'Great seller!',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('rating');
      expect(response.body).toHaveProperty('previousRating');
      expect(response.body).toHaveProperty('sellerNewRating');
      expect(response.body.rating.score).toBe(5);
    });

    it('should prevent duplicate ratings', async () => {
      const response = await request(app)
        .post('/api/ratings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          transactionId: testTransaction.id,
          buyerId: testBuyer.id,
          sellerId: testSeller.id,
          score: 4,
          comment: 'Trying to rate again',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('You have already rated this transaction');
    });

    it('should validate rating score', async () => {
      const response = await request(app)
        .post('/api/ratings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          transactionId: testTransaction.id,
          buyerId: testBuyer.id,
          sellerId: testSeller.id,
          score: 6,
          comment: 'Invalid score',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Score must be between 1 and 5');
    });
  });

  describe('GET /ratings/seller/:sellerId', () => {
    it('should get seller ratings with statistics', async () => {
      const response = await request(app).get(`/api/ratings/seller/${testSeller.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('ratings');
      expect(response.body).toHaveProperty('statistics');
      expect(response.body.statistics).toHaveProperty('totalRatings');
      expect(response.body.statistics).toHaveProperty('averageRating');
      expect(response.body.statistics).toHaveProperty('distribution');
    });
  });
});
