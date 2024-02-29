const http = require('http');
const https = require('https');
const url = require('url');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com',
  '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',
  'https://clientsystemproject2024.vercel.app/oauth2callback'
);

let userCredential = null;

// Generate the OAuth 2.0 authorization URL
const clientId = '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com';
const redirectUri = 'https://clientsystemproject2024.vercel.app/oauth2callback';
const scope = 'openid profile email phone'; 

const generatedLink = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

async function main() {
  const server = http.createServer(async function (req, res) {
    // Example on redirecting user to Google's OAuth 2.0 server.
    if (req.url == '/') {
      res.writeHead(301, { "Location": generatedLink });
    }

    if (req.url.startsWith('/oauth2callback')) {
        // Handle the OAuth 2.0 server response
        let q = url.parse(req.url, true).query;
    
        if (q.error) { // An error response e.g. error=access_denied
            console.log('Error:' + q.error);
        } else { // Get access and refresh tokens (if access_type is offline)
            let { tokens } = await oauth2Client.getToken(q.code);
            oauth2Client.setCredentials(tokens);
    
            /** Save credential to the global variable in case access token was refreshed.
              * ACTION ITEM: In a production app, you likely want to save the refresh token
              *              in a secure persistent database instead. */
            userCredential = tokens;
    
            // Redirect to authorised.html after successful consent
            res.writeHead(302, { 'Location': '/authorised.html' });
            res.end();
        }
    }
    
    

    // The rest of your code...
  }).listen(80);
}

main().catch(console.error);
