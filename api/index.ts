const express = require('express');
const { google } = require('googleapis');
const url = require('url'); // Importing the 'url' module
const http = require('http');


const app = express();
const PORT = process.env.PORT || 3000;

// OAuth 2.0 credentials
const CLIENT_ID = '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback'; // Redirect URL

// Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

// Route to handle the OAuth 2.0 callback
app.get('/oauth2callback', async (req, res) => {
  try {
    // Receive the callback from Google's OAuth 2.0 server
    let q = url.parse(req.url, true).query;

    // Get access and refresh tokens (if access_type is offline)
    let { tokens } = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(tokens);

    // Redirect to authorized.html after obtaining the access token
    res.redirect('/authorized.html');
  } catch (error) {
    console.error('Error exchanging authorization code for tokens:', error);
    res.status(500).send('Error exchanging authorization code for tokens.');
  }
});

// Example of using Google People API to retrieve user's email address
const people = google.people({ version: 'v1' });
people.people.get({
  auth: oauth2Client,
  resourceName: 'people/me',
  personFields: 'emailAddresses'
}, (err, res) => {
  if (err) {
    console.error('The API returned an error:', err);
    return;
  }

  const emailAddresses = res.data.emailAddresses;
  if (emailAddresses && emailAddresses.length > 0) {
    console.log('Email Addresses:');
    emailAddresses.forEach((email) => {
      console.log(email.value);
    });
  } else {
    console.log('No email address found.');
  }
});



const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // Parse the received JSON data
      const data = JSON.parse(body);
      
      // Log the received data
      console.log('Received data:', data);
      
      // Send a response to the client
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Data received successfully.');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
