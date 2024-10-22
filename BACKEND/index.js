const express = require('express');
const { Pool } = require('pg');
const app = express();

// Log to confirm that the server is starting
console.log("Starting server...");

// Create a connection pool to the Postgres database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware to parse JSON bodies
app.use(express.json());

// Log to confirm middleware is loaded
console.log("Middleware loaded...");

// API route to fetch data from the Postgres database
app.get('/api/data', async (req, res) => {
  try {
    console.log("Fetching data from the database...");
    const result = await pool.query('SELECT * FROM your_table_name');
    console.log("Query result:", result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send('Server error');
  }
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
