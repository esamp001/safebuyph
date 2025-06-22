const express = require('express');
require('dotenv').config(); // Kinda questionable if this is stll working
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const checktokenBlacklist = require('./middleware/checktokenBlacklist');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const marketplaceRoutes = require('./routes/marketplace');

// Initialize express
const app = express();

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Basic Helmet setup with common security headers
// app.use(helmet()); REDUNDANT

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
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow only request from these domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed only these methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true, // true lets the browser send cookies/auth headers with the request.
  maxAge: 86400, // Reduce the number of options request 24hrs
  exposedHeaders: ['Content-Range', 'X-Content-Range'], //	Headers the browser is allowed to read
};

// Apply CORS with options
app.use(cors(corsOptions));

// Move cookieParser before other middleware
app.use(cookieParser());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '5mb' }));

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
app.use('/api/marketplace', marketplaceRoutes);

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
