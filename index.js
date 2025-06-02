// Prepared by: Kirubel Temesgen
// Purpose: This system allows businesses to create accounts, crud(create, retrieve, update and delete) 
// customer data securely, and utilise this information to enhance decision-making and pricing strategies.
// Technologies used: NodeJs, Html, Css, MySQL, ExpressJs, GoogleApi, Ngrok(For cloud deployment)
require('dotenv').config();

const express = require("express");
const session = require('express-session');
const mysql = require('mysql2');
const cors = require('cors');
const { google } = require('googleapis');
const bodyParser = require("body-parser");
// Paths
const path = require("path");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const onboardRoutes = require("./routes/onboard");
const socialRoutes = require("./routes/use-social");
const manualRoutes = require("./routes/manually-input");
const checkpermssionRoutes = require("./routes/check-permission");
const oauthRoutes = require("./routes/oauth-callback");
const authorisedClientRoute = require("./routes/authorised-client");
const retrievedClientRoute = require("./routes/retrieved-client");
const clientRoutes = require("./routes/client");
const logoutRoutes = require('./routes/logout');



const app = express();


app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

//- Express (https://www.npmjs.com/package/express)
//- Express Session (https://www.npmjs.com/package/express-session)
//- MySQL (https://www.npmjs.com/package/mysql)
//- Cors (https://www.npmjs.com/package/cors)
//- Google APIs (https://www.npmjs.com/package/googleapis)

const masterDbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

// Route handler for the root endpoint
app.get('/', (req, res) => {
    // Redirect to the /signup endpoint
    res.redirect('/signup');
});
    


// Function to establish a connection to the user's database
function establishUserDbConnection(userDbConfig) {
    return mysql.createConnection(userDbConfig);
}

// Route to render the signup page
app.get('/signup', (req, res) => {
    
    // Send the signup page HTML as the response
    res.sendFile(path.join(__dirname, 'views/signup.html'));
});

// Route to render the login page
app.get('/login', (req, res) => {
    // Send the login page HTML as the response
    res.sendFile(path.join(__dirname, 'views/login.html'));
});


app.use("/", authRoutes);



app.use("/", dashboardRoutes);


app.use("/", onboardRoutes);

app.use("/", socialRoutes);

app.use("/", manualRoutes);

app.use("/", checkpermssionRoutes);

app.use("/", oauthRoutes);


app.use("/", authorisedClientRoute);

app.use("/", retrievedClientRoute);

app.use("/", clientRoutes);

app.use('/', logoutRoutes);


app.listen(3000, '0.0.0.0', () => {
  console.log('Server ready on port 3000');
});


