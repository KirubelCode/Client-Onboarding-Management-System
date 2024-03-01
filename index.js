const express = require("express");
const { google } = require('googleapis');

const app = express();

const oauth2Client = new google.auth.OAuth2({
  clientId: '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com',
  clientSecret: 'GOCSPX-vLPZH5iKPkX18khO9iQhPizKppX',
  redirectUri: 'https://clientsystemproject2024.vercel.app/oauth2callback'
});

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  // Add more scopes if needed
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});

app.get("/", (req, res) => {
  res.redirect(authUrl);
});

app.get("/oauth2callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const people = google.people({ version: 'v1', auth: oauth2Client });
    const profile = await people.people.get({ resourceName: 'people/me', personFields: 'names,emailAddresses,phoneNumbers' });

    const { names, emailAddresses, phoneNumbers } = profile.data;
    const name = names && names.length > 0 ? names[0].displayName : '';
    const email = emailAddresses && emailAddresses.length > 0 ? emailAddresses[0].value : '';
    const phone = phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0].value : '';

    // Process retrieved user information
    res.redirect('/authorised')
    res.json({ name, email, phone });
  } catch (error) {
    console.error('Error retrieving user information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;
