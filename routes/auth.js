const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Added missing jwt import
const { PrismaClient } = require('../generated/prisma'); // Fix import path
const auth = require('../middleware/auth');
const router = express.Router();
const { redisClient } = require('../config/redis');
const crypto = require('crypto');
const validator = require('validator');
const bodyParser = require('body-parser');

// Initialize Prisma client
const prisma = new PrismaClient();

// Handle Prisma connection errors
prisma.$on('error', (e) => {
  console.error('Prisma Error:', e);
});

router.post('/register', async (req, res) => {
  // Call all the data from user Model
  const { name, email, password, phoneNumber, profilePic, role, status, bio } = req.body;

  // Required field validation
  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Name, email and password are required fields',
    });
  }

  // Name validation
  if (!validator.isLength(name, { min: 2, max: 50 })) {
    return res.status(400).json({
      error: 'Name must be between 2 and 50 characters',
    });
  }

  if (
    !validator.matches(password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  ) {
    return res.status(400).json({
      error:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    });
  }

  // Phone number validation (if provided)
  if (phoneNumber && !validator.isMobilePhone(phoneNumber, 'en-PH')) {
    return res.status(400).json({
      error: 'Please enter a valid Philippine phone number (+63 or 0 followed by 10 digits)',
    });
  }

  // Profile picture URL validation (if provided)
  if (profilePic) {
    // Check if it's a base64 string
    if (!profilePic.startsWith('data:image/')) {
      return res.status(400).json({
        error: 'Invalid image format. Please upload a valid image file.',
      });
    }

    // Check if base64 string is not too long (2MB limit)
    const base64Data = profilePic.split(',')[1];
    const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
    if (sizeInBytes > 2 * 1024 * 1024) {
      return res.status(400).json({
        error: 'Image size should be less than 2MB',
      });
    }
  }

  // Role validation
  const validRoles = ['buyer', 'seller', 'admin'];
  if (role && !validator.isIn(role, validRoles)) {
    return res.status(400).json({
      error: 'Role must be either buyer, seller, or admin',
    });
  }

  // Status validation
  const validStatuses = ['active', 'suspended', 'inactive'];
  if (status && !validator.isIn(status, validStatuses)) {
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
        isAdmin: false,
        canSell: false,
        status: 'active',
        transactionCount: 0,
        rating: 3.0,
        bio: bio || '',
      },
    });

    const accessToken = jwt.sign(
      {
        userId: newUser.id,
        name: newUser.name,
        type: 'access',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // for local dev (true only for HTTPS/production)
      sameSite: 'lax', // <-- change from 'strict' to 'lax'
      maxAge: 1 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: 'User register successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        profilePic: newUser.profilePic,
        status: newUser.status,
        transactionCount: newUser.transactionCount,
        rating: newUser.rating,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        bio: newUser.bio,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: 'Error creating user',
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate access token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.isAdmin ? 'admin' : user.canSell ? 'seller' : 'buyer',
        name: user.name,
        type: 'access',
      },
      process.env.JWT_SECRET || 'your-secret-key', // Add fallback secret
      { expiresIn: '1h' }
    );

    // Generate refresh token
    const refreshTokenRaw = crypto.randomBytes(64).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex');

    // Set expiry for refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store refresh token
    const storedToken = await prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        userId: user.id,
        expiresAt,
        isRevoked: false,
      },
    });

    if (!storedToken) {
      throw new Error('Failed to store refresh token');
    }

    // Send response
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken: refreshTokenRaw,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.isAdmin ? 'admin' : user.canSell ? 'seller' : 'buyer',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Failed to login. Please try again.',
    });
  }
});

//Logout w/ token blacklisting
router.post('/logout', auth, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // Check if Redis is connected
    if (!redisClient.isReady) {
      console.error('Redis client not connected');
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Redis connection not ready',
      });
    }

    // Verify token is valid before blacklisting
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ensure token belongs to the logged-in user
      if (decoded.userId !== req.user.userId) {
        return res.status(403).json({ message: 'Token does not match current user' });
      }

      // Calculate remaining time
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);

      // Check if token is already expired
      if (exp <= now) {
        return res.status(400).json({ message: 'Token is already expired' });
      }

      // Calculate TTL (time-to-live)
      const ttl = exp - now;

      try {
        // Check if token is already blacklisted
        const isBlacklisted = await redisClient.get(`bl_${token}`);
        if (isBlacklisted) {
          return res.status(400).json({ message: 'Token is already logged out' });
        }

        // Add token to blacklist
        await redisClient.set(`bl_${token}`, 'true', {
          EX: ttl,
          NX: true, // Only set if not exists
        });

        // Log the logout action
        console.log(`User ${decoded.userId} logged out successfully`);

        return res.json({
          message: 'Logged out successfully',
          details: {
            userId: decoded.userId,
            tokenExpiry: new Date(exp * 1000).toISOString(),
          },
        });
      } catch (redisError) {
        console.error('Redis operation error:', redisError);
        throw redisError;
      }
    } catch (tokenError) {
      if (tokenError instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      throw tokenError; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error('Logout error:', error);

    // Handle specific error types
    if (error.name === 'RedisError') {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Unable to process logout request',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process logout',
    });
  }
});

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      error: 'Refresh token is required',
    });
  }

  try {
    // Hash the received refresh token
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Find stored token and check if it's valid
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: hashedToken,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!storedToken) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: storedToken.user.id,
        role: storedToken.user.isAdmin ? 'admin' : storedToken.user.canSell ? 'seller' : 'buyer',
        name: storedToken.user.name,
        type: 'access',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Generate new refresh token
    const newRefreshTokenRaw = crypto.randomBytes(64).toString('hex');
    const newHashedRefreshToken = crypto
      .createHash('sha256')
      .update(newRefreshTokenRaw)
      .digest('hex');

    // Set expiry for new refresh token
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    // Revoke old refresh token and create new one
    await prisma.$transaction([
      // Revoke old token
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      }),
      // Create new refresh token
      prisma.refreshToken.create({
        data: {
          token: newHashedRefreshToken,
          userId: storedToken.user.id,
          expiresAt: newExpiresAt,
          isRevoked: false,
        },
      }),
    ]);

    // Create new JWT refresh token
    const newRefreshToken = jwt.sign(
      {
        userId: storedToken.user.id,
        type: 'refresh',
        tokenId: newHashedRefreshToken,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshTokenRaw,
      user: {
        id: storedToken.user.id,
        name: storedToken.user.name,
        email: storedToken.user.email,
        role: storedToken.user.isAdmin ? 'admin' : storedToken.user.canSell ? 'seller' : 'buyer',
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
});

router.post('/validate-credentials', async (req, res) => {
  const { email, password } = req.body;

  // Email format validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Please enter a valid email address',
    });
  }

  // Password strength validation
  if (!validator.isLength(password, { min: 8 })) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long',
    });
  }

  if (
    !validator.matches(password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  ) {
    return res.status(400).json({
      error:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
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

    // If all validations pass
    return res.status(200).json({
      message: 'Credentials are valid',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error validating credentials',
    });
  }
});

module.exports = router;
