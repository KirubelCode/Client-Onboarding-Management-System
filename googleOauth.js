const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const oauth2Client = new google.auth.OAuth2(
    '527812031278-0ciq72bf110usrbtarv06o0vo8qbr8nf.apps.googleusercontent.com',
    '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',
    'https://client-onboarding-management-system.vercel.app/use-social.html'
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
];

// Redirect to Google's OAuth 2.0 server for consent
app.get('/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(authUrl);
});

// Handle the callback from Google's OAuth 2.0 server
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.redirect('/retrieve-client-details');
    } catch (error) {
        console.error('Error authenticating with Google:', error);
        res.status(500).send('Error authenticating with Google');
    }
});

// Retrieve client details from People API
app.get('/retrieve-client-details', async (req, res) => {
    try {
        const people = google.people({ version: 'v1', auth: oauth2Client });
        const { data } = await people.people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses,phoneNumbers'
        });
        const { names, emailAddresses, phoneNumbers } = data;
        const userDetails = {
            name: names[0].displayName,
            email: emailAddresses[0].value,
            phone: phoneNumbers[0].value
        };
        fs.writeFileSync('user_details.txt', JSON.stringify(userDetails));
        res.redirect('/retrieved-client');
    } catch (error) {
        console.error('Error retrieving client details:', error);
        res.status(500).send('Error retrieving client details.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
