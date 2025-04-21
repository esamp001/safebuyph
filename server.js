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

// Use Routes
app.use('/api/auth', authRoutes);

// Create login route
app.post('/login', (req, res) => {
  // TODO: Implement login logic
  res.status(200).json({ message: 'Login endpoint reached' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
