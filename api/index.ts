const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// OAuth 2.0 credentials
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
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
    console.log('OAuth 2.0 callback initiated');

    // Retrieve the authorization code from the query parameters
    const code = req.query.code;
    console.log('Authorization code:', code);

    // Exchange authorization code for refresh and access tokens
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens:', tokens);

    // Set credentials for OAuth2 client
    oauth2Client.setCredentials(tokens);

    // Redirect to success page or perform further actions
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
