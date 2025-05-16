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

    // Check rating only if seller has completed transactions
    if (user.transactionCount > 0 && user.rating < 3.0) {
      return res.status(400).json({ error: 'Seller does not meet minimum rating requirements' });
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

    if (!validator.isLength(name, { min: 2, max: 50 })) {
      return res.status(400).json({
        error: 'Name must be between 2 and 50 characters',
      });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email address',
      });
    }

    if (phoneNumber && !validator.isMobilePhone(phoneNumber, 'en-PH')) {
      return res.status(400).json({
        error: 'Please enter a valid Philippine phone number (+63 or 0 followed by 10 digits)',
      });
    }

    if (profilePic && !validator.isURL(profilePic)) {
      return res.status(400).json({
        error: 'Please enter a valid URL for profile picture',
      });
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

// Simple seller verification with ID photo and number
router.post('/become-seller', authMiddleware, async (req, res) => {
  const { validIdUrl, validIdNumber, sellingDescription } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.canSell) {
      return res.status(400).json({ message: 'You are already registered as a seller' });
    }

    // Validate required fields
    if (!validIdUrl || !validIdNumber) {
      return res.status(400).json({
        message: 'Please provide both ID photo URL and ID number',
        required: {
          validIdUrl: 'URL to your ID photo',
          validIdNumber: 'Your ID number',
        },
      });
    }

    if (!sellingDescription || sellingDescription.length < 4) {
      return res.status(400).json({
        error: 'Please provide a description of what you are selling (minimum 4 characters)',
      });
    }

    // Simple URL or base64 format validation
    const isBase64 = validIdUrl.startsWith('data:image/');
    if (!isBase64) {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (!urlRegex.test(validIdUrl)) {
        return res.status(400).json({
          error: 'Please provide a valid URL or base64 image for your ID photo',
        });
      }
    }

    // Basic ID number validation (at least 4 characters)
    if (validIdNumber.length < 4) {
      return res.status(400).json({
        error: 'Please provide a valid ID number (minimum 4 characters)',
      });
    }

    // Automatically approve seller status
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        canSell: true,
        validIdUrl,
        validIdNumber,
        sellingDescription,
      },
    });

    res.json({
      message: 'Congratulations! You can now sell on SafeBuy PH',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        canSell: true,
      },
    });
  } catch (error) {
    console.error('Error becoming a seller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
