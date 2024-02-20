const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// OAuth 2.0 credentials
const CLIENT_ID = '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback'; 

// Create an OAuth2 client
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Get authorization URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile', 
    'https://www.googleapis.com/auth/userinfo.email' 
  ]
});

app.get('/auth/google', (req, res) => {
  res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    // Use tokens to make requests to Google APIs
    // Example: const userData = await google.oauth2('v2').userinfo.get({ auth: oAuth2Client });
    res.send('Authentication successful!');
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    res.status(500).send('Error authenticating with Google');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
