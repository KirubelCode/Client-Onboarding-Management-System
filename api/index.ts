const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// OAuth 2.0 credentials
const CLIENT_ID = '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback'; // Corrected redirect URL

// Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});


// Route to handle the OAuth 2.0 callback
app.get('/oauth2callback', async (req, res) => {
  try {
    const code = req.query.code;

    // Exchange authorization code for refresh and access tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Redirect to auth.html after obtaining the access token
    res.redirect('/authroised.html');
  } catch (error) {
    console.error('Error exchanging authorization code for tokens:', error);
    res.status(500).send('Error exchanging authorization code for tokens.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
