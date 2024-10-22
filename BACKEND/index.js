const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a root route
app.get('/', (req, res) => {
  res.send('Hello, World!'); // You can customize this message
});

// Your other routes, e.g.:
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM your_table_name');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
