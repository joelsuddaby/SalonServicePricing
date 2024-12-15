// backend/server.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5001;

// Enable CORS so that your React app can make requests
app.use(cors());

// Set up the database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Replace with your MySQL username
  password: 'Karhu118',  // Replace with your MySQL password
  database: 'charlotteshairsaloon'      // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// API endpoint to fetch products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM producttable', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Error fetching products');
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});