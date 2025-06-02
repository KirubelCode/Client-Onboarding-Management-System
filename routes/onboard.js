const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/onboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/onboard.html"));
});

module.exports = router;
