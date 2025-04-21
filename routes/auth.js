const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  // Call all the data from user Model
  const { name, email, password, phoneNumber, profilePic, role, status } = req.body;

  // Use Validation

  // Required field validation
  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Name, email and password are required fields',
    });
  }

  // Name validation
  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({
      error: 'Name must be between 2 and 50 characters',
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Please enter a valid email address',
    });
  }

  // Password strength validation
  if (password.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long',
    });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    });
  }

  // Phone number validation (if provided)
  if (phoneNumber) {
    const phoneRegex = /^(\+63|0)[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        error: 'Please enter a valid Philippine phone number (+63 or 0 followed by 10 digits)',
      });
    }
  }

  // Profile picture URL validation (if provided)
  if (profilePic) {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(profilePic)) {
      return res.status(400).json({
        error: 'Please enter a valid URL for profile picture',
      });
    }
  }

  // Role validation
  const validRoles = ['buyer', 'seller'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({
      error: 'Role must be either buyer or seller',
    });
  }

  // Status validation
  const validStatuses = ['active', 'suspended', 'inactive'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status value',
    });
  }

  // Check if email already exists
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error checking email existence',
    });
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save it to DB
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      profilePic,
      role,
      status,
      idVerified,
      transactionCount,
      rating,
    },
  });

  res.status(201).json({
    message: 'User register successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      profilePic: newUser.profilePic,
      role: newUser.role,
      status: newUser.status,
      idVerified: newUser.idVerified,
      transactionCount: newUser.transactionCount,
      rating: newUser.rating,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    },
  });
});

module.exports = router;
