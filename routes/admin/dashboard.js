const express = require('express');
const authMiddleware = require('../../middleware/auth');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const isAdmin = require('../../middleware/isAdmin');
const router = express.Router();

router.get('/dashboard', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: `Welcome, ${req.user.name || 'admin'}!` });
});

router.put('/suspend-user/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const suspendedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'suspended' },
    });

    res.json({ message: `User ${req.params.id} has been suspended` });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ message: 'Failed to suspend user' });
  }
});

// New endpoint to verify users
router.put('/verify-user/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'seller') {
      return res.status(400).json({ message: 'Only seller accounts can be verified' });
    }

    const verifiedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { idVerified: true },
    });

    res.json({
      message: `User ${req.params.id} has been verified`,
      user: {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        role: verifiedUser.role,
        idVerified: verifiedUser.idVerified,
      },
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ message: 'Failed to verify user' });
  }
});

router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/transactions', authMiddleware, isAdmin, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        buyer: true,
        seller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// New endpoint to update user rating
router.put('/update-rating/:id', authMiddleware, isAdmin, async (req, res) => {
  const { rating } = req.body;

  if (rating === undefined || rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 0 and 5' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { rating: parseFloat(rating) },
    });

    res.json({
      message: `User ${req.params.id} rating updated to ${rating}`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        rating: updatedUser.rating,
      },
    });
  } catch (error) {
    console.error('Error updating user rating:', error);
    res.status(500).json({ message: 'Failed to update user rating' });
  }
});

module.exports = router;
