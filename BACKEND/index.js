const express = require('express');
const { Pool } = require('pg');
const app = express();

// Create a connection pool to the Postgres database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware to parse JSON bodies
app.use(express.json());

// API route to fetch data from the Postgres database
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM your_table_name');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = app;  // No app.listen() needed
