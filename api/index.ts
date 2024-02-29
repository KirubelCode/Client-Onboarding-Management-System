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
    res.json(user); // Send the user details as JSON response
  } catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).send('Error retrieving user details');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
