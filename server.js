const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { redisClient } = require('./config/redis');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const checktokenBlacklist = require('./middleware/checktokenBlacklist');
const validator = require('validator');

// Initialize express
const app = express();

// Basic Helmet setup with common security headers
app.use(helmet());

// Or if you want more specific control, use this configuration:
app.use(
  helmet({
    // Disable Content Security Policy
    contentSecurityPolicy: false,

    // Hide X-Powered-By header
    hidePoweredBy: true,

    // Configure XSS Filter
    xssFilter: true,

    // Prevent clickjacking
    frameguard: {
      action: 'deny',
    },

    // Strict Transport Security
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },

    // Prevent MIME type sniffing
    noSniff: true,

    // DNS Prefetch Control
    dnsPrefetchControl: {
      allow: false,
    },

    // Referrer Policy
    referrerPolicy: {
      policy: 'no-referrer',
    },
  })
);

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Allow your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true, // Allow credentials (cookies, authorization headers)
  maxAge: 86400, // Cache preflight requests for 24 hours
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

// Apply CORS with options
app.use(cors(corsOptions));

// Rest of your middleware
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

// Create rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again after 15 minutes',
});

// Import Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const transactionRoutes = require('./routes/transaction');
const adminRoutes = require('./routes/admin/dashboard');
const ratingRoutes = require('./routes/rating');

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/refresh-token', authLimiter);

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/profile', checktokenBlacklist, profileRoutes);
app.use('/api/transaction', checktokenBlacklist, transactionRoutes);
app.use('/api/admin', checktokenBlacklist, adminRoutes);
app.use('/api/ratings', checktokenBlacklist, ratingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
