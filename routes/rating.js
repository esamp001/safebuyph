const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// POST /ratings
router.post('/', authMiddleware, async (req, res) => {
  const { transactionId, buyerId, sellerId, score, comment } = req.body;

  try {
    // Input validation
    if (!transactionId || !buyerId || !sellerId || !score) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify buyer authorization
    if (req.user.userId !== buyerId) {
      return res.status(403).json({ error: 'Only the buyer can rate this transaction' });
    }

    // Rating score validation
    if (score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
    }

    // Comment length validation
    if (comment && comment.length > 500) {
      return res.status(400).json({ error: 'Comment is too long (max 500 characters)' });
    }

    // Fetch the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    // Transaction validation
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only rate completed transactions' });
    }

    if (transaction.buyerId !== buyerId || transaction.sellerId !== sellerId) {
      return res.status(400).json({ error: 'Invalid transaction details' });
    }

    // Check for duplicate rating
    const existingRating = await prisma.rating.findFirst({
      where: {
        transactionId,
        buyerId,
      },
    });

    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this transaction' });
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Create the rating
      const rating = await prisma.rating.create({
        data: {
          transactionId,
          buyerId,
          sellerId,
          score,
          comment,
        },
      });

      // Get seller's current data
      const seller = await prisma.user.findUnique({
        where: { id: sellerId },
        select: {
          rating: true,
          transactionCount: true,
        },
      });

      // Get all ratings for this seller
      const sellerRatings = await prisma.rating.findMany({
        where: { sellerId },
      });

      // Calculate new average rating
      let newAverageRating;
      if (sellerRatings.length === 1) {
        // This is the first rating, combine with default rating (3.0)
        newAverageRating = parseFloat(((3.0 + score) / 2).toFixed(2));
      } else {
        // Calculate based on all ratings
        const totalScore = sellerRatings.reduce((sum, r) => sum + r.score, 0);
        const totalRatings = sellerRatings.length;
        newAverageRating = parseFloat((totalScore / totalRatings).toFixed(2));
      }

      // Ensure rating stays within bounds
      newAverageRating = Math.max(0, Math.min(5, newAverageRating));

      // Update seller rating and increment transaction count
      const updatedSeller = await prisma.user.update({
        where: { id: sellerId },
        data: {
          rating: newAverageRating,
          transactionCount: {
            increment: 1,
          },
        },
      });

      return {
        rating,
        previousRating: seller.rating,
        newSellerRating: updatedSeller.rating,
        transactionCount: updatedSeller.transactionCount,
      };
    });

    // Send success response
    res.status(201).json({
      message: 'Rating created successfully',
      rating: result.rating,
      previousRating: result.previousRating,
      sellerNewRating: result.newSellerRating,
      sellerTransactionCount: result.transactionCount,
    });
  } catch (error) {
    console.error('Error creating rating:', error);

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Duplicate rating' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid transaction or user reference' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /ratings/seller/:sellerId
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;

    const ratings = await prisma.rating.findMany({
      where: { sellerId: parseInt(sellerId) },
      include: {
        buyer: {
          select: {
            name: true,
            profilePic: true,
          },
        },
        transaction: {
          select: {
            createdAt: true,
            amount: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate rating statistics
    const stats = {
      totalRatings: ratings.length,
      averageRating: ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length || 0,
      distribution: {
        5: ratings.filter((r) => r.score === 5).length,
        4: ratings.filter((r) => r.score === 4).length,
        3: ratings.filter((r) => r.score === 3).length,
        2: ratings.filter((r) => r.score === 2).length,
        1: ratings.filter((r) => r.score === 1).length,
      },
    };

    res.json({
      ratings,
      statistics: stats,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

module.exports = router;
