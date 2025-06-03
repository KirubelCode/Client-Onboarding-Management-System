const express = require("express");
const { google } = require("googleapis");
const router = express.Router();

let clientData = {};  // shared in this file

router.get("/oauth2callback", async (req, res) => {
  const userData = req.session.userData;

  if (!userData) return res.status(401).send("Unauthorized");

  const oauth2Client = new google.auth.OAuth2(
    userData.GoogleClientId,
    userData.GoogleClientSecret,
    userData.RedirectUri
  );

  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const people = google.people({ version: "v1", auth: oauth2Client });
    const profile = await people.people.get({
      resourceName: "people/me",
      personFields: "addresses,names,phoneNumbers,emailAddresses"
    });

    const { addresses, names, phoneNumbers, emailAddresses } = profile.data;

    clientData = {
      address: addresses?.[0]?.formattedValue || '',
      phone: phoneNumbers?.[0]?.canonicalForm || '',
      email: emailAddresses?.[0]?.value || '',
      firstName: names?.[0]?.givenName || '',
      lastName: names?.[0]?.familyName || ''
    };

    res.redirect("/authorised-client");
  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/getClientData", (req, res) => {
  res.json(clientData);
});

module.exports = router;
