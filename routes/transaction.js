const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

//Create new transasction
router.post('/', authMiddleware, async (req, res) => {
  const { sellerId, amount } = req.body;

  if (!sellerId || !amount || amount <= 0)
});


