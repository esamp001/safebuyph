const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// Protected route to get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, phoneNumber, profilePic, email, createdAt, updatedAt } = req.body;
    // Simple Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Name is required',
      });
    }

    //email is required
    if (!email || email.trim().length === 0) {
      return res.status(400).json({
        error: 'Email is required',
      });
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        error: 'Name must be between 2 and 50 characters',
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Please enter a valid email address',
        });
      }
    }

    if (phoneNumber) {
      const phoneRegex = /^(\+63|0)[0-9]{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          error: 'Please enter a valid Philippine phone number (+63 or 0 followed by 10 digits)',
        });
      }
    }

    if (profilePic) {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlRegex.test(profilePic)) {
        return res.status(400).json({
          error: 'Please enter a valid URL for profile picture',
        });
      }
    }

    // Prevent modification of timestamps
    if (createdAt || updatedAt) {
      return res.status(400).json({
        error: 'Cannot modify timestamp fields',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        name,
        email,
        phoneNumber,
        profilePic,
      },
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
