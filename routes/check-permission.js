const express = require("express");
const path = require("path");
const router = express.Router();

// Route to check permission for email details extraction
router.get('/check-permission', (req, res) => {
   
    res.sendFile(path.join(__dirname, '../views/check-permission.html'));
});

module.exports = router;
