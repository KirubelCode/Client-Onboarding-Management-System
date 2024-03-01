const http = require('http');
const https = require('https');
const url = require('url');
const { google } = require('googleapis');
const express = require("express");
const app = express();


// OAuth 2.0 credentials
const clientId = '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'https://clientsystemproject2024.vercel.app/oauth2callback';

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

async function main() {
  // Define the required scopes
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/user.phonenumbers.read'
  ];

  // Generate the OAuth 2.0 authorization URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
    include_granted_scopes: true
  });

  const server = http.createServer(async function (req, res) {
    if (req.url === '/') {
      // Redirect user to Google's OAuth 2.0 server
      res.writeHead(302, { Location: authUrl });
      res.end();
    }

    if (req.url.startsWith('/oauth2callback')) {
      // Handle the OAuth 2.0 server response
      const query = url.parse(req.url, true).query;

      if (query.error) {
        console.error('Error:', query.error);
        // Handle the error appropriately
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Error occurred during authentication.');
      } else {
        try {
          const { tokens } = await oauth2Client.getToken(query.code);
          console.log('Received tokens:', tokens);
          oauth2Client.setCredentials(tokens);

          // Redirect to authorised.html after successful consent
          res.writeHead(302, { 'Location': '/authorised.html' });
          res.end();
        } catch (error) {
          console.error('Error exchanging authorization code for tokens:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error exchanging authorization code for tokens.');
        }
      }
    }

    // Handle other routes or requests if needed...

  }).listen(80);

  console.log('Server running at http://localhost:80/');
}


app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;

main().catch(console.error);

