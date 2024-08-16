require('dotenv').config();
const express = require('express');
const authRoutes = require('./auth'); // Import the authentication routes

const app = express();
const port = 5000;

// Middleware to serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

// Use the authentication routes
app.use('/auth', authRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server successful, listening on port ${port}`);
});
