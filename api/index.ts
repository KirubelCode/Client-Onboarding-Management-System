const http = require('http');
const https = require('https');
const url = require('url');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/oauth2callback'
);


const scopes = ['https://www.googleapis.com/auth/userinfo.email'];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true
});

let userCredential = null as { access_token?: string } | null;

async function main() {
  const server = http.createServer(async function (req, res) {
    if (req.url == '/') {
      res.writeHead(301, { "Location": authorizationUrl });
    }

    if (req.url.startsWith('/oauth2callback')) {
      let q = url.parse(req.url, true).query;
      if (q.error) {
        console.error('Error: ' + q.error);
      } else {
        let { tokens } = await oauth2Client.getToken(q.code);
        oauth2Client.setCredentials(tokens);
        userCredential = tokens;

        // Handle API requests or further actions here
      }
    }

    if (req.url == '/revoke') {
      let postData = '';
      if (userCredential && userCredential.access_token) {
        postData = 'token=' + userCredential.access_token;
      } else {
        console.error('Access token is not available.');
        // Handle the error appropriately
      }

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
        console.error(error);
      });

      postReq.write(postData);
      postReq.end();
    }

    res.end();
  }).listen(3000);
}

main().catch(console.error);

