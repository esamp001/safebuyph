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

module.exports = router;
