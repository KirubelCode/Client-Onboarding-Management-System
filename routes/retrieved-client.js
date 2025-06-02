const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/retrieved-client", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/retrieved-client.html"));
});

module.exports = router;
