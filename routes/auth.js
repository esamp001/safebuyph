const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Added missing jwt import
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

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
  const validRoles = ['buyer', 'seller', 'admin'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({
      error: 'Role must be either buyer, seller, or admin',
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
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        profilePic,
        role,
        status,
        idVerified: false,
        transactionCount: 0,
        rating: 0,
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
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: 'Error creating user',
    });
  } finally {
    await prisma.$disconnect();
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    // Validate password requirements
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long',
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        error: 'Password must contain at least one uppercase letter',
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        error: 'Password must contain at least one lowercase letter',
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        error: 'Password must contain at least one number',
      });
    }

    if (!/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({
        error: 'Password must contain at least one special character (!@#$%^&*)',
      });
    }

    // Check if user exists
    // Query the database to find a user with the provided email
    const user = await prisma.user.findUnique({
      where: { email }, // Search by email field
    });

    // If no user is found with that email, return an error
    if (!user) {
      return res.status(400).json({
        error: 'User not found in database',
      });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

    //Respond with token
    // Send successful response with:
    // - Success message
    // - JWT token for authentication
    // - User details (id, name, email) for client-side use
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Log the full error details for debugging
    console.error('Login error:', error.message);
    console.error('Error stack:', error.stack);

    // Send more specific error message based on error type
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Email already exists',
      });
    } else if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'User not found',
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Invalid token',
      });
    } else if (error instanceof bcrypt.BcryptError) {
      return res.status(400).json({
        error: 'Password hashing error',
      });
    }

    return res.status(500).json({
      error: 'Internal server error: ' + error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
