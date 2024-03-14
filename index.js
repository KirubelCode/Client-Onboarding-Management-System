const express = require("express");
const { google } = require('googleapis');
const phpExpress = require("php-express")();
const cors = require('cors');





const app = express();
const path = require('path'); // Import the path module

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
// Enable CORS for all requests
app.use(cors());

const mysql = require('mysql');

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'C00260396',
  password: 'SetuCarlow2024',
  database: 'ClientsDB',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Export the db object for use in other modules
module.exports = db;


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

const bodyParser = require("body-parser");

let clientData = {};
app.use(bodyParser.json());

// Endpoint to set client data
app.post("/setClientData", (req, res) => {
  const { email, phone, address } = req.body;
  clientData = { email, phone, address };
  res.json({ message: "Client data updated successfully" });
});

// Endpoint to get client data
app.get("/getClientData", (req, res) => {
  res.json(clientData);
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
      personFields: 'addresses,names,phoneNumbers,emailAddresses' // Include addresses, names, phoneNumbers, and emailAddresses
    });

    const { addresses, names, phoneNumbers, emailAddresses } = profile.data;
    const address = addresses && addresses.length > 0 ? addresses[0].formattedValue : '';
    const phoneNumber = phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0].canonicalForm : '';
    const email = emailAddresses && emailAddresses.length > 0 ? emailAddresses[0].value : '';
    const firstName = names && names.length > 0 ? names[0].givenName : '';
    const lastName = names && names.length > 0 ? names[0].familyName : '';

    // Update client data
    clientData = { email, phone: phoneNumber, address, firstName, lastName };

    // Redirect to retrievedClient.html
    res.redirect('/authorised.html');

  } catch (error) {
    console.error('Error retrieving user information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Handle POST request to addClient.php
app.post("/addClient.php", (req, res) => {
  const { firstName, lastName, phone, address, email } = req.body;

  // Insert data into the database
  const sql = `INSERT INTO clientInfo (firstName, lastName, phone, address, email) VALUES (?, ?, ?, ?, ?)`;
  const values = [firstName, lastName, phone, address, email];

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting client:", err);
      res.status(500).send("Error inserting client");
    } else {
      console.log("Client inserted successfully");
      res.send("Form submitted successfully!");
    }
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;
