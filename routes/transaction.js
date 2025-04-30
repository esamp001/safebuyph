const express = require('express');
const { PrismaClient, TransactionStatus } = require('../generated/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

//Create new transasction
router.post('/', authMiddleware, async (req, res) => {
  const { sellerId, amount, price } = req.body;

  if (!sellerId) {
    return res.status(400).json({ error: 'Seller doesnt exist in database!' });
  }

  try {
    // First find and validate seller
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
    });

    // Check if seller exists
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Prevent self-transactions
    if (seller.id === req.user.userId) {
      return res.status(400).json({ error: 'Cannot create transaction with yourself' });
    }

    // Check seller status
    if (seller.status !== 'active') {
      return res.status(400).json({ error: 'Seller account is not active' });
    }

    // Check if seller is verified
    if (!seller.idVerified) {
      return res.status(400).json({ error: 'Seller is not verified' });
    }

    // Check if user is actually a seller
    if (seller.role !== 'seller') {
      return res.status(400).json({ error: 'User is not registered as a seller' });
    }

    // Optional: Check seller rating
    if (seller.rating < 3.0) {
      // minimum rating requirement
      return res.status(400).json({ error: 'Seller does not meet minimum rating requirements' });
    }

    if (!sellerId || !amount || !price || amount <= 0 || price <= 0) {
      return res
        .status(400)
        .json({ error: 'Seller ID, valid amount, and valid price are required' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        buyerId: req.user.userId,
        sellerId,
        amount,
        status: 'PENDING',
        price,
      },
    });

    res.status(201).json({ message: 'Transaction created', transaction });
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

// Get all transactions of the user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ buyerId: req.user.userId }, { sellerId: req.user.userId }],
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            profilePic: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            profilePic: true,
          },
        },
      },
    });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Fetch error', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!Object.values(TransactionStatus).includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    // Only buyer can mark complete
    const tx = await prisma.transaction.findUnique({ where: { id: +id } });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    //Ensure buyer can only complete transact
    if (status === TransactionStatus.COMPLETED && tx.buyerId !== req.user.userId) {
      return res.status(403).json({ message: 'Only buyer can complete this transaction' });
    }

    const updated = await prisma.transaction.update({
      where: { id: +id },
      data: { status },
    });
    res.json({ message: 'Status update', transaction: updated });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Releease escrow
router.post('/:id/release', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const tx = await prisma.transaction.findUnique({ where: { id: +id } });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    if (tx.buyerId !== req.user.userId) {
      return res.status(403).json({ message: 'Only buyer can release escrow' });
    }
    const updated = await prisma.transaction.update({
      where: { id: +id },
      data: { status: TransactionStatus.COMPLETED },
    });
    res.json({ message: 'Escrow released', transaction: updated });
  } catch (err) {
    console.error('Release error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//SafeBuy PH Recommended Flow (with Admin Review): ! (NOTE NOT YET DONE FOR THIS)
// Step	Action	Result
// 1	Seller marks item as shipped	Starts 3-day countdown
// 2	Buyer receives the item	Normal
// 3	Buyer files a dispute anyway	Dispute is logged, countdown stops
// 4	Admin reviews the dispute	Decision required
// 5	Admin resolves in favor of buyer	Refund issued or transaction canceled
// 6	Admin resolves in favor of seller	Escrow is released to seller

router.patch('/:id/dispute', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim().length === 0) {
    return res.status(400).json({ message: 'Dispute reason is required' });
  }
  // Check if there's a record using ID when use postman
  try {
    const tx = await prisma.transaction.findUnique({ where: { id: +id } });

    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    //Only buyer or seller involve can file dispute
    if (tx.buyerId !== req.user.userId && tx.sellerId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to dispute this transaction' });
    }

    if (tx.status === 'COMPLETED' || tx.status === 'CANCELLED') {
      return res
        .status(400)
        .json({ message: 'Cannot dispute a completed or cancelled transaction' });
    }

    // Check if transaction is already disputed:
    if (tx.status === 'DISPUTED') {
      return res.status(400).json({ message: 'Transaction is already under dispute' });
    }

    // Check if duspute reason is already exists:
    if (tx.disputeReason) {
      return res
        .status(400)
        .json({ message: 'Dispute reason already exists for this transaction' });
    }

    // Check if there's a cooldown period between dispute attempts
    if (tx.disputedAt) {
      const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const lastDisputeTime = new Date(tx.disputedAt).getTime();
      const currentTime = new Date().getTime();

      if (currentTime - lastDisputeTime < cooldownPeriod) {
        return res.status(400).json({
          message: 'Please wait 24 hours between dispute attempts',
        });
      }
    }

    // Update body using prisma

    const updated = await prisma.transaction.update({
      where: { id: +id },
      dat: {
        status: 'DISPUTED',
        disputeReason: reason,
        disputedAt: new Date(),
      },
    });

    res.json({ message: 'Dispute logged', transaction: updated });
  } catch (err) {
    console.error('Dispute error:', err);
    res.status(500).json({ message: 'Server error while filing dispute' });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ buyerId: req.user.userId }, { sellerId: req.user.userId }],
        status: {
          in: [TransactionStatus.COMPLETED, TransactionStatus.DISPUTED],
        },
      },
      include: {
        buyer: true,
        seller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ transactions });
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ message: 'Server error while fetching history' });
  }
});

module.exports = router;
