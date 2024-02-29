const http = require('http');
const https = require('https');
const url = require('url');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/oauth2callback'
);

let userCredential = null;

// Generate the OAuth 2.0 authorization URL
const clientId = 'YOUR_CLIENT_ID';
const redirectUri = 'YOUR_REDIRECT_URI';
const scope = 'openid profile email phone'; 

const generatedLink = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

async function main() {
  const server = http.createServer(async function (req, res) {
    // Example on redirecting user to Google's OAuth 2.0 server.
    if (req.url == '/') {
      res.writeHead(301, { "Location": generatedLink });
    }

    // Receive the callback from Google's OAuth 2.0 server.
    if (req.url.startsWith('/oauth2callback')) {
      let q = url.parse(req.url, true).query;

      if (q.error) { // An error response e.g. error=access_denied
        console.log('Error:' + q.error);
      } else {
        let { tokens } = await oauth2Client.getToken(q.code);
        oauth2Client.setCredentials(tokens);
        userCredential = tokens;

        // Handle further actions after successful authentication
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('Authentication successful! You can close this tab now.');
      }
    }

    // The rest of your code...
  }).listen(80);
}

main().catch(console.error);
