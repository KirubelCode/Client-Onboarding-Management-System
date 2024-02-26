// In authRoutes.js
const express = require('express');
const router = express.Router();

// Route for Google authentication
router.get('/google', (req, res) => {
    // Handle Google authentication logic
});

// Callback route after Google authentication
router.get('/google/callback', (req, res) => {
    // Handle callback logic after Google authentication
});

module.exports = router;
