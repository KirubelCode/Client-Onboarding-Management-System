const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/use-social", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/use-social.html"));
});

router.get("/generate-oauth-link", (req, res) => {
    const userData = req.session.userData;
    if (!userData) return res.status(401).json({ error: "Unauthorized" });

    const clientId = userData.GoogleClientId;
    const redirectUri = userData.RedirectUri;
    const scope = 'openid profile email phone';
    const generatedLink = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

    res.json({ link: generatedLink });
});

module.exports = router;
