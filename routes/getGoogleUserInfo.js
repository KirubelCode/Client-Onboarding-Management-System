const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// Create an OAuth2 client (assuming you already have oauth2Client configured)

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
    console.log(`Server is running on http://localhost:${PORT}`);
});
