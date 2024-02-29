const http = require('http');
const https = require('https');
const url = require('url');
const { google } = require('googleapis');

const YOUR_CLIENT_ID = 'YOUR_CLIENT_ID';
const YOUR_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const YOUR_REDIRECT_URL = 'YOUR_REDIRECT_URL';

const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true
});

let userCredential = null;

async function main() {
  const server = http.createServer(async function (req, res) {
    if (req.url == '/') {
      res.writeHead(301, { "Location": authorizationUrl });
    }

    if (req.url.startsWith('/oauth2callback')) {
      let q = url.parse(req.url, true).query;
      if (q.error) {
        console.log('Error:' + q.error);
      } else {
        let { tokens } = await oauth2Client.getToken(q.code);
        oauth2Client.setCredentials(tokens);
        userCredential = tokens;

        // Retrieve user's profile information
        const people = google.people({ version: 'v1', auth: oauth2Client });
        people.people.get({
          resourceName: 'people/me',
          personFields: 'names,emailAddresses,phoneNumbers',
        }, (err, res) => {
          if (err) {
            console.error('The API returned an error:', err);
            return;
          }
          const profile = res.data;
          console.log('Name:', profile.names[0].displayName);
          console.log('Email:', profile.emailAddresses[0].value);
          console.log('Phone:', profile.phoneNumbers[0].value);
        });
      }
    }

    if (req.url == '/revoke') {
      let postData = "token=" + userCredential.access_token;
      let postOptions = {
        host: 'oauth2.googleapis.com',
        port: '443',
        path: '/revoke',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const postReq = https.request(postOptions, function (res) {
        res.setEncoding('utf8');
        res.on('data', d => {
          console.log('Response: ' + d);
        });
      });

      postReq.on('error', error => {
        console.log(error)
      });

      postReq.write(postData);
      postReq.end();
    }

    res.end();
  }).listen(80);
}

main().catch(console.error);
