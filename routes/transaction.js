const express = require('express');
const { PrismaClient, TransactionStatus } = require('../generated/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// At the top of the file, add valid statuses
const VALID_STATUSES = [
  'PENDING',
  'ACCEPTED',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED',
  'DISPUTED',
  'CANCELLED',
];

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

    // Check if seller is authorized to sell
    if (!seller.canSell) {
      return res.status(400).json({ error: 'Seller is not authorized to sell at this time' });
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
  const { status, shippingProof, shippingTrackingNumber, paymentProof, paymentTransactionNumber } =
    req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: 'Invalid status',
      validStatuses: VALID_STATUSES,
    });
  }

  try {
    const tx = await prisma.transaction.findUnique({
      where: { id: +id },
      include: { seller: true, buyer: true },
    });

    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    // Check permissions based on status change
    if (status === 'COMPLETED') {
      // Only buyer can complete transaction
      if (tx.buyerId !== req.user.userId) {
        return res.status(403).json({ message: 'Only buyer can complete this transaction' });
      }
      // Can only complete if status is DELIVERED
      if (tx.status !== 'DELIVERED') {
        return res.status(400).json({ message: 'Transaction must be delivered before completion' });
      }
    } else if (status === 'ACCEPTED') {
      // Only seller can accept
      if (tx.sellerId !== req.user.userId) {
        return res.status(403).json({ message: 'Only seller can accept this transaction' });
      }
      // Can only accept if status is PENDING
      if (tx.status !== 'PENDING') {
        return res.status(400).json({ message: 'Can only accept pending transactions' });
      }
    } else if (status === 'PAID') {
      // Only buyer can mark as paid
      if (tx.buyerId !== req.user.userId) {
        return res.status(403).json({ message: 'Only buyer can mark as paid' });
      }
      // Can only pay if status is ACCEPTED
      if (tx.status !== 'ACCEPTED') {
        return res
          .status(400)
          .json({ message: 'Transaction must be accepted by seller before payment' });
      }
      // Validate payment proof and transaction number
      if (!paymentProof || !paymentTransactionNumber) {
        return res.status(400).json({
          message: 'Payment proof and transaction number are required',
          required: {
            paymentProof: 'URL of payment receipt',
            paymentTransactionNumber: 'Transaction/Reference number from payment',
          },
        });
      }
      // Validate payment proof URL
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlRegex.test(paymentProof)) {
        return res.status(400).json({ message: 'Please provide a valid URL for payment proof' });
      }
      // Validate transaction number
      if (!/^[A-Za-z0-9]{6,}$/.test(paymentTransactionNumber)) {
        return res.status(400).json({
          message:
            'Invalid transaction number format. Must be alphanumeric and at least 6 characters',
        });
      }
    } else if (status === 'SHIPPED') {
      // Only seller can ship
      if (tx.sellerId !== req.user.userId) {
        return res.status(403).json({ message: 'Only seller can mark as shipped' });
      }
      // Can only ship if status is PAID
      if (tx.status !== 'PAID') {
        return res.status(400).json({ message: 'Transaction must be paid before shipping' });
      }
      // Validate shipping proof and tracking number
      if (!shippingProof || !shippingTrackingNumber) {
        return res.status(400).json({
          message: 'Shipping proof and tracking number are required',
          required: {
            shippingProof: 'URL of shipping receipt or proof image',
            shippingTrackingNumber: 'Tracking number from courier service',
          },
        });
      }
      // Validate shipping proof URL
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlRegex.test(shippingProof)) {
        return res.status(400).json({ message: 'Please provide a valid URL for shipping proof' });
      }
      // Validate tracking number
      if (!/^[A-Za-z0-9]{8,}$/.test(shippingTrackingNumber)) {
        return res.status(400).json({
          message: 'Invalid tracking number format. Must be alphanumeric and at least 8 characters',
        });
      }
    } else if (status === 'CANCELLED') {
      // Both buyer and seller can cancel
      if (tx.buyerId !== req.user.userId && tx.sellerId !== req.user.userId) {
        return res
          .status(403)
          .json({ message: 'Only buyer or seller can cancel this transaction' });
      }
      // Can only cancel if status is PENDING or ACCEPTED
      if (tx.status !== 'PENDING' && tx.status !== 'ACCEPTED') {
        return res
          .status(400)
          .json({ message: 'Can only cancel pending or accepted transactions' });
      }
    }

    let updateData = { status };

    // Add additional data based on status
    if (status === 'PAID') {
      const paidAt = new Date();
      const shippingDeadline = new Date(paidAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours from payment
      updateData = {
        ...updateData,
        paidAt,
        shippingDeadline,
        paymentProof,
        paymentTransactionNumber,
      };
    } else if (status === 'SHIPPED') {
      const now = new Date();
      const isLateShipment = tx.shippingDeadline && now > tx.shippingDeadline;

      // If shipment is late, decrease seller rating
      if (isLateShipment) {
        const newRating = Math.max(0, tx.seller.rating - 0.5);
        await prisma.user.update({
          where: { id: tx.sellerId },
          data: {
            rating: newRating,
            status: newRating === 0 ? 'suspended' : 'active',
          },
        });
      }

      updateData = {
        ...updateData,
        shippedAt: now,
        shippingProof,
        shippingTrackingNumber,
      };
    }

    const updated = await prisma.transaction.update({
      where: { id: +id },
      data: updateData,
    });

    // Prepare response message
    let message = 'Status updated';
    if (status === 'ACCEPTED') {
      message = 'Transaction accepted by seller. Waiting for buyer payment.';
    } else if (status === 'PAID') {
      message = 'Payment confirmed. Seller should ship within 24 hours.';
    } else if (status === 'SHIPPED') {
      message = 'Item shipped. Waiting for delivery confirmation.';
    } else if (status === 'DELIVERED') {
      message = 'Delivery confirmed. Escrow released to seller.';
    } else if (status === 'CANCELLED') {
      message = 'Transaction cancelled';
    } else if (status === 'COMPLETED') {
      message = 'Transaction completed';
    } else if (status === 'DISPUTED') {
      message = 'Transaction under dispute';
    }

    res.json({
      message,
      transaction: updated,
    });
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

// THIS IS THE PART WHEN SHIPPER IS INVOLVED
router.post('/:id/ship', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { shippingProof, shippingTrackingNumber } = req.body;

  // Validate required fields
  if (!shippingProof || !shippingTrackingNumber) {
    return res.status(400).json({
      message: 'Shipping proof and tracking number are required',
      required: {
        shippingProof: 'URL of shipping receipt or proof image',
        shippingTrackingNumber: 'Tracking number from courier service',
      },
    });
  }

  // Validate URL format
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (!urlRegex.test(shippingProof)) {
    return res.status(400).json({
      message: 'Please provide a valid URL for shipping proof',
    });
  }

  // Validate tracking number format (alphanumeric, min 8 chars)
  if (!/^[A-Za-z0-9]{8,}$/.test(shippingTrackingNumber)) {
    return res.status(400).json({
      message: 'Invalid tracking number format. Must be alphanumeric and at least 8 characters',
    });
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
      include: { seller: true },
    });

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (transaction.sellerId !== req.user.userId) {
      return res.status(403).json({ message: 'Only seller can ship the item' });
    }

    // Check if transaction is in PAID status
    if (transaction.status !== 'PAID') {
      return res.status(400).json({ message: 'Transaction must be in PAID status to be shipped' });
    }

    const now = new Date();
    const isLateShipment = transaction.shippingDeadline && now > transaction.shippingDeadline;

    // Calculate auto-confirmation deadline (3 days from shipping)
    const autoConfirmationDeadline = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // If shipment is late, decrease seller rating by 0.5
    let sellerUpdate = {};
    if (isLateShipment) {
      const newRating = Math.max(0, transaction.seller.rating - 0.5);
      sellerUpdate = {
        rating: newRating,
        status: newRating === 0 ? 'suspended' : 'active',
      };

      // Update seller if rating changed
      if (Object.keys(sellerUpdate).length > 0) {
        await prisma.user.update({
          where: { id: transaction.sellerId },
          data: sellerUpdate,
        });
      }
    }

    // Only set auto-confirmation deadline if not already set
    const updateData = {
      status: 'SHIPPED',
      shippingProof,
      shippingTrackingNumber,
      shippedAt: now,
      receivedAt: now, // Set initial received time to shipping time
    };

    // Only add autoConfirmationDeadline if not already set
    if (!transaction.autoConfirmationDeadline) {
      updateData.autoConfirmationDeadline = autoConfirmationDeadline;
    }

    const updated = await prisma.transaction.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json({
      message: isLateShipment
        ? 'Transaction marked as shipped. Warning: Late shipment detected, rating decreased by 0.5'
        : 'Transaction marked as shipped. Will be auto-confirmed in 3 days if not confirmed by buyer.',
      transaction: updated,
      isLateShipment,
      newRating: sellerUpdate.rating,
      autoConfirmationDeadline: updated.autoConfirmationDeadline,
    });
  } catch (err) {
    console.error('Shipment update error:', err);
    res.status(500).json({ message: 'Server error while marking shipment' });
  }
});
// Order confirmation
router.patch('/:id/confirm-delivery', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
      include: { seller: true },
    });

    if (!transaction) return res.status(404).json({ message: 'Transaction not found!' });
    if (transaction.buyerId !== req.user.userId)
      return res.status(403).json({ message: 'Only the buyer can confirm the delivery' });

    const now = new Date();

    // Check if delivery is already confirmed
    if (transaction.deliveryConfirmed) {
      return res.status(400).json({ message: 'Delivery is already confirmed, escrow released' });
    }

    // Check if escrow is already released
    if (transaction.escrowReleased) {
      return res.status(400).json({ message: 'Escrow is already released' });
    }

    // Auto-release escrow if past the confirmation deadline
    if (transaction.autoConfirmationDeadline && now > transaction.autoConfirmationDeadline) {
      const updated = await prisma.transaction.update({
        where: { id: Number(id) },
        data: {
          status: 'COMPLETED',
          deliveryConfirmed: true,
          deliveryConfirmedAt: now,
          escrowReleased: true,
          autoReleased: true,
        },
      });

      return res.json({
        message: 'Transaction auto-completed due to confirmation deadline passing',
        transaction: updated,
      });
    }

    // Manual confirmation by buyer
    const updated = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        status: 'COMPLETED',
        deliveryConfirmed: true,
        deliveryConfirmedAt: now,
        escrowReleased: true,
        autoReleased: false,
      },
    });

    res.json({ message: 'Delivery confirmed and escrow released', transaction: updated });
  } catch (err) {
    console.error('Delivery confirmation error:', err);
    res.status(500).json({ message: 'Server error while confirming delivery' });
  }
});

// Report bad transaction and handle seller rating
router.post('/:id/report-seller', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim().length === 0) {
    return res.status(400).json({ message: 'Reason for report is required' });
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
      include: { seller: true },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Only buyer can report
    if (transaction.buyerId !== req.user.userId) {
      return res.status(403).json({ message: 'Only the buyer can report this transaction' });
    }

    // Can only report completed or delivered transactions
    if (transaction.status !== 'COMPLETED' && transaction.status !== 'DELIVERED') {
      return res
        .status(400)
        .json({ message: 'Can only report completed or delivered transactions' });
    }

    // Decrease seller rating by 1
    const newRating = Math.max(0, transaction.seller.rating - 1);

    // Update seller rating and status
    const updatedSeller = await prisma.user.update({
      where: { id: transaction.sellerId },
      data: {
        rating: newRating,
        // If rating hits 0, automatically suspend the seller
        status: newRating === 0 ? 'suspended' : 'active',
      },
    });

    // Update transaction to mark it as reported
    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        disputeReason: reason,
        disputedAt: new Date(),
        status: 'DISPUTED',
      },
    });

    res.json({
      message: 'Seller reported and rating updated',
      newRating,
      sellerStatus: updatedSeller.status,
      transaction: updatedTransaction,
    });
  } catch (err) {
    console.error('Error reporting seller:', err);
    res.status(500).json({ message: 'Server error while reporting seller' });
  }
});

module.exports = router;
