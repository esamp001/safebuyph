const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('./generated/prisma'); // Updated path to match schema output

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Sample route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to SAFEBUY PH');
});

// Create register route
// Decide the endpoint URL
app.post('/register', async (req, res) => {
  //Collect user input
  const { name, email, password } = req.body;

  // Validate user input
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  // Email format check (simple version)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email.' });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Store password but make it Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
});

// Create login route
app.post('/login', (req, res) => {
  // TODO: Implement login logic
  res.status(200).json({ message: 'Login endpoint reached' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
