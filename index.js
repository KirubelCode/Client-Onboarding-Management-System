const express = require("express");
const { google } = require('googleapis');

const app = express();
const path = require('path'); // Import the path module

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

const clientId = '527812031278-crmp1nf91o3a0i72v8kaeboo8baqrqjg.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri,
});

const scopes = [
  'https://www.googleapis.com/auth/user.addresses.read',
  'https://www.googleapis.com/auth/user.phonenumbers.read',
  'https://www.googleapis.com/auth/userinfo.email',
  'profile' // Include the profile scope
];

app.get("/", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '), // Join scopes with space separator
  });
  res.redirect(authUrl);
});


app.get("/oauth2callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);

    // Automatically set the credentials for the OAuth2 client
    oauth2Client.setCredentials(tokens);

    // Create a new OAuth2 client with the obtained tokens
    const oauth2ClientWithTokens = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2ClientWithTokens.setCredentials(tokens);

    const people = google.people({ version: 'v1', auth: oauth2ClientWithTokens });
    const profile = await people.people.get({
      resourceName: 'people/me',
      personFields: 'addresses,phoneNumbers,emailAddresses'
    });

    const { addresses, phoneNumbers, emailAddresses } = profile.data;
    const address = addresses && addresses.length > 0 ? addresses[0].formattedValue : '';
    const phoneNumber = phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0].canonicalForm : '';
    const email = emailAddresses && emailAddresses.length > 0 ? emailAddresses[0].value : '';

    // Redirect to the authorised.html page in the public folder
    res.redirect("/authorised.html");

  } catch (error) {
    console.error('Error retrieving user information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;