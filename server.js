const express = require('express');
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

// Example route to get all users (Using Prisma)
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Example route to create new transaction
app.post('/transactions', async (req, res) => {
    const { product, price, buyerId, sellerId } = req.body;
    try {
        const transaction = await prisma.transaction.create({
            data: {
                product,
                price,
                status: 'pending',
                buyerId,
                sellerId
            }
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
