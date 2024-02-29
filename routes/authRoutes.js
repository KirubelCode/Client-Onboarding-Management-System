const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2({
  clientId: '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'https://clientsystemproject2024.vercel.app/oauth2callback',
});

// Route to handle the OAuth 2.0 callback
app.get('/oauth2callback', async (req, res) => {
  try {
    // Get the authorization code from the query parameters
    const code = req.query.code;

    // Exchange authorization code for refresh and access tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Optionally, you can store the tokens or use them to make requests to Google APIs

    res.send('Authorization successful! Tokens obtained.');
  } catch (error) {
    console.error('Error exchanging authorization code for tokens:', error);
    res.status(500).send('Error exchanging authorization code for tokens.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});