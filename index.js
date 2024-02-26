const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');

// Middleware to serve static files (HTML, CSS, JS) from the public directory
app.use(express.static('public'));

// Define routes
app.use('/auth', authRoutes); // Routes related to authentication
app.use('/client', clientRoutes); // Routes related to clients

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

