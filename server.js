const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

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
app.use('/api/profile', profileRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ratings', ratingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
