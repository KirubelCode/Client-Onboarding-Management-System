const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/authorised-client", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/authorised-client.html"));
});

module.exports = router;
