// test-db.js
require('dotenv').config();
const { Client } = require('pg');
async function testConnection() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
      await client.connect();
      console.log('✅ Connected successfully!');
    } catch (err) {
      console.error('❌ Connection error:', err.message);
    } finally {
      await client.end();
    }
  }
  
  testConnection();