const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/faq", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/faq.html"));
});

module.exports = router;
