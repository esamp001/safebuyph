const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { redisClient } = require('./config/redis');

// Import middleware with correct casing
const checkTokenBlacklist = require('./middleware/checktokenBlacklist');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const transactionRoutes = require('./routes/transaction');
const adminRoutes = require('./routes/admin/dashboard');
const ratingRoutes = require('./routes/rating');

// Use Routes
app.use('/api/auth', authRoutes);

// Protected routes - add blacklist check
app.use('/api/profile', checkTokenBlacklist, profileRoutes);
app.use('/api/transaction', checkTokenBlacklist, transactionRoutes);
app.use('/api/admin', checkTokenBlacklist, adminRoutes);
app.use('/api/ratings', checkTokenBlacklist, ratingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
