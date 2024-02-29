const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// OAuth 2.0 credentials
const CLIENT_ID = '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://clientsystemproject2024.vercel.app/authroised.html'; 

// Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
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

// Get authorization URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile', 
    'https://www.googleapis.com/auth/userinfo.email' 
  ]
});

// Route to initiate OAuth2 flow
app.get('/auth/google', (req, res) => {
  res.redirect(authUrl);
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
    
    // Send the access token back to the client
    res.send(tokens.access_token);
  } catch (error) {
    console.error('Error exchanging authorization code for tokens:', error);
    res.status(500).send('Error exchanging authorization code for tokens.');
  }
});


// Create an instance of the People API
const people = google.people({ version: 'v1', auth: oauth2Client });

// Route handler to retrieve user details from Google People API
app.get('/get-user-details', async (req, res) => {
  try {
    // Call the people.get method to retrieve the user's profile information
    const response = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,phoneNumbers'
    });

    const user = response.data;
    const { names, emailAddresses, phoneNumbers } = user;

    // Prepare the user details to send back as JSON response
    const userDetails = {
      name: names[0].displayName,
      email: emailAddresses[0].value,
      phone: phoneNumbers[0].value
    };

    // Send the user details as JSON response
    res.json(userDetails);
  } catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).send('Error retrieving user details');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server iss running on http://localhost:${PORT}`);
});
