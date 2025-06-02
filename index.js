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


// Route handler to serve the client management page
app.get("/manage-clients", async (req, res) => {
    const userDbConfig = req.session.userDbConfig;

    if (!userDbConfig) {
        res.status(401).json({ error: 'User not authenticated or database configuration missing' });
        return;
    }

    const userDbConnection = establishUserDbConnection(userDbConfig);

    try {
        await userDbConnection.connect(); // Connect to the user database

        const sql = `SELECT ID, firstName, lastName, email, phone, address FROM clientInfo`;

        userDbConnection.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching client data:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                // Generate HTML for client dropdown menu options and client details
                const clientOptions = results.map(client => {
                    return `<option value="${client.ID}">${client.firstName} ${client.lastName}</option>`;
                }).join('');

                const clientDetails = results.reduce((acc, client) => {
                    acc[client.ID] = {
                        firstName: client.firstName || '',
                        lastName: client.lastName || '',
                        email: client.email || '',
                        phone: client.phone || '',
                        address: client.address || ''
                    };
                    return acc;
                }, {});

                // Serve the HTML template with dynamic client data
                const htmlTemplate = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Manage Clients</title>
                        <style>
                             body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5; 
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            max-width: 800px;
            margin: 20px;
            padding: 20px;
            background-color: #fff;
            border: 2px;
            border-radius: 50px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-style: outset;
            margin-left: 15%;
        }

        .client-dropdown {
            margin-bottom: 20px;
        }

        .client-details {
            margin-bottom: 20px;
        }

        .client-details label {
            display: block;
            margin-bottom: 10px;
            color: #333;
            font-weight: bold;
            margin: 10px;
        }

        .client-details input {
            width: calc(100% - 22px); 
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            transition: border-color 0.3s;
        }

        .client-details input:focus {
            border-color: #007bff; /* Highlight border color on focus */
            outline: none;
        }

        .button-container {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .button-container button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        .button-container button:hover {
            background-color: #007bff;
            color: #fff;
            margin-right: 10px;
            
        }

        .back-button {
    position: fixed;
    bottom: 20px; 
    left: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    
}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Manage Clients</h1>
                            <div class="client-dropdown">
                                <label for="clientSelect">Select Client:</label>
                                <select id="clientSelect" onchange="selectClient()">
                                    <option value="">Select a client</option>
                                    ${clientOptions}
                                </select>
                            </div>
                            <div id="clientDetails" class="client-details">
                                <label for="firstName">First Name:</label>
                                <input type="text" id="firstName" name="firstName" readonly value="">
                                <label for="lastName">Last Name:</label>
                                <input type="text" id="lastName" name="lastName" readonly value="">
                                <label for="email">Email:</label>
                                <input type="text" id="email" name="email" readonly value="">
                                <label for="phone">Phone:</label>
                                <input type="text" id="phone" name="phone" readonly value="">
                                <label for="address">Address:</label>
                                <input type="text" id="address" name="address" readonly value="">
                            </div>
                        </div>
                        <div class="button-container">
                            <button onclick="editClient()">Edit Client</button>
                            <button onclick="updateClient()">Update Client</button>
                            <button onclick="deleteClient()">Delete Client</button>
                        </div>
                        <button onclick="goBack()" class="back-button">Back</button>
                    
                        <script>
                            const clientDetails = ${JSON.stringify(clientDetails)};

                            function selectClient() {
                                const clientId = document.getElementById('clientSelect').value;

                                if (clientId && clientDetails[clientId]) {
                                    const { firstName, lastName, email, phone, address } = clientDetails[clientId];
                                    document.getElementById('firstName').value = firstName;
                                    document.getElementById('lastName').value = lastName;
                                    document.getElementById('email').value = email;
                                    document.getElementById('phone').value = phone;
                                    document.getElementById('address').value = address;
                                } else {
                                    // Clear text boxes if no client selected or client details not found
                                    document.getElementById('firstName').value = '';
                                    document.getElementById('lastName').value = '';
                                    document.getElementById('email').value = '';
                                    document.getElementById('phone').value = '';
                                    document.getElementById('address').value = '';
                                }
                            }

                            function editClient() {
                                // Allow editing of client details
                                document.querySelectorAll('.client-details input').forEach(input => {
                                    input.removeAttribute('readonly');
                                });
                            }

                            function updateClient() {
                                const clientId = document.getElementById('clientSelect').value;
                                const firstName = document.getElementById('firstName').value;
                                const lastName = document.getElementById('lastName').value;
                                const email = document.getElementById('email').value;
                                const phone = document.getElementById('phone').value;
                                const address = document.getElementById('address').value;
                            
                                
                                if (!clientId) {
                                    alert('Please select a client to update');
                                    return;
                                }
                            
                                // Send updated client details to the server 
                                const updatedClient = {
                                    clientId,
                                    firstName,
                                    lastName,
                                    email,
                                    phone,
                                    address
                                };
                            
                                
                                fetch('/updateClient', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(updatedClient)
                                })
                                .then(response => {
                                    if (response.ok) {
                                        // Update client details in the UI 
                                        alert('Client updated successfully');
                                    } else {
                                        // Handle server-side errors or display error message
                                        alert('Failed to update client');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error updating client:', error);
                                    alert('Error updating client');
                                });
                            }
                            

                            function deleteClient() {
                                const clientId = document.getElementById('clientSelect').value;
                            
                               
                                if (!clientId) {
                                    alert('Please select a client to delete');
                                    return;
                                }
                            
                                // Prompt the user for confirmation 
                                const confirmation = confirm('Are you sure you want to delete this client?');
                            
                                if (!confirmation) {
                                    return; // User canceled the deletion operation
                                }
                            
                                // Trigger the server-side deletion operation
                                fetch('/deleteClient', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ clientId })
                                })
                                .then(response => {
                                    if (response.ok) {
                                        // Client deleted successfully
                                        alert('Client deleted successfully');
                                        
                                    } else {
                                        // Failed to delete client
                                        alert('Failed to delete client');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error deleting client:', error);
                                    alert('Error deleting client');
                                });
                            }                            
                            
                            

                            function goBack() {
                                window.history.back();
                            }
                        </script>
                    </body>
                    </html>
                `;

                res.send(htmlTemplate);
            }

            userDbConnection.end(); // Close the database connection
        });
    } catch (error) {
        console.error('Error connecting to user database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Endpoint to serve the HTML page
app.get('/searchClientsPage', (req, res) => {
    // Render the HTML content
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Search Clients</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
            }
            
            h1 {
                color: #000000;
                text-align: center;
                margin-top: 5%;
            }
            
            .search-container {
                margin-top: 5%;
                text-align: center;
                margin-bottom: 20px;
            }
            
            #searchInput {
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                width: 200px;
                margin-right: 10px;
            }
            
            button {
                padding: 8px 12px;
                border-radius: 5px;
                color: #000;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            button:hover {
                background-color: #007bff;
                color: #fff;
            }
            
            .search-results {
                margin: 0 auto;
                max-width: 600px;
                height: 300px; /* Set a fixed height for the container */
                overflow-y: auto; /* Allow vertical scrolling within the container */
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            
            .copy-button {
                margin-top: 20px;
                padding: 8px 12px;
                border-radius: 5px;
                background-color: #007bff;
                color: #fff;
                cursor: pointer;
                margin-left: 15%;
            }
            
            .back-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                padding: 10px 20px;
                font-size: 16px;
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            
</style>            
        </head>
        <body>
            <h1>Search Clients</h1>
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Enter keyword...">
                <button onclick="searchClients()">Search</button>
                <br><br>
                <p>(Leave empty to search all clients)</p>
            </div>
            <div class="search-results" id="searchResults"></div>
            <script>
            /*Mozilla Developer Network. (n.d.). XMLHttpRequest. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest */

                function searchClients() {
                    const keyword = document.getElementById('searchInput').value.trim();
                   
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', '/searchClientAddress', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            document.getElementById('searchResults').innerHTML = xhr.responseText;
                        } else {
                            alert('Error searching for clients');
                        }
                    };
                    xhr.send(JSON.stringify({ keyword }));
                }
                function copyData() {
                    const searchResults = document.getElementById('searchResults').innerText;
                    navigator.clipboard.writeText(searchResults)
                        .then(() => {
                            alert("Data copied to clipboard");
                        })
                        .catch(error => {
                            console.error('Error copying data:', error);
                            alert("Error copying data");
                        });
                }
                function goBack() {
                    window.history.back();
                }
            </script>
            <button class="copy-button" onclick="copyData()">Copy All Data</button>
            <br><br>
            <button onclick="goBack()" class="back-button">Back</button>
        </body>
        </html>
    `;

    // Send the HTML content as the response
    res.send(htmlContent);
});



// Endpoint to handle client search by address
app.post('/searchClientAddress', (req, res) => {
    const { keyword } = req.body; // Extract keyword from request body

    const userDbConfig = req.session.userDbConfig;

    if (!userDbConfig) {
        res.status(401).json({ error: 'User not authenticated or database configuration missing' });
        return;
    }

    const userDbConnection = establishUserDbConnection(userDbConfig);

    // Construct SQL query to search for clients by address containing the keyword
    const sql = "SELECT * FROM clientInfo WHERE address LIKE ?";

    // Construct search pattern by adding % around the keyword
    const searchKeyword = `%${keyword}%`;

    // Connect to the user database using userDbConfig
    userDbConnection.connect((err) => {
        if (err) {
            console.error('Error connecting to user database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Execute the query with prepared statement
        userDbConnection.query(sql, [searchKeyword], (err, results) => {
            if (err) {
                console.error('Error searching for clients:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                // Construct HTML content based on search results
                let htmlContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Search Results</title>
                        <style>
                            
                        </style>
                    </head>
                    <body>
                        <h1>Search Results</h1>
                        <div class="search-results">`;

                if (results.length > 0) {
                    results.forEach(client => {
                        htmlContent += `
                            <div class="client-details">
                                <label>ID:</label> ${client.ID}<br>
                                <label>First Name:</label> ${client.firstName}<br>
                                <label>Last Name:</label> ${client.lastName}<br>
                                <label>Email:</label> ${client.email}<br>
                                <label>Phone:</label> ${client.phone}<br>
                                <label>Address:</label> ${client.address}<br>
                                <br>
                            </div>`;
                    });
                } else {
                    htmlContent += `<p>No clients found with the specified keyword.</p>`;
                }

                htmlContent += `
                        </div>
                    </body>
                    </html>`;

                res.send(htmlContent); // Send the dynamically generated HTML as the response
            }

            
        });
    });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server ready on port 3000');
});


