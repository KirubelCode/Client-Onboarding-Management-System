const express = require("express");
const session = require('express-session');
const mysql = require("mysql2");
const path = require("path");
const router = express.Router();

const masterDbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};


// Route for handling signup requests
router.post("/signup", async (req, res) => {
    const { username, dbname, clientId, clientSecret, redirectUri, password } = req.body;

    const adminConn = mysql.createConnection(masterDbConfig);

    adminConn.connect((err) => {
        if (err) {
            console.error('Error connecting to MasterDB:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const checkExistingSql = `SELECT COUNT(*) AS count_exists FROM ClientData WHERE ClientUsername = ?`;

        adminConn.query(checkExistingSql, [username], (err, results) => {
            if (err) {
                console.error('Error querying MasterDB:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            const countExists = results[0].count_exists;

            if (countExists > 0) {
                res.status(400).json({ error: 'Client already exists in the database.' });
                return;
            }

            const insertSql = `
                INSERT INTO ClientData (ClientUsername, DatabaseName, GoogleClientId, GoogleClientSecret, RedirectUri, ClientPassword)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            adminConn.query(insertSql, [username, dbname, clientId, clientSecret, redirectUri, password], (err) => {
                if (err) {
                    console.error('Error inserting client information:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                const createDbSql = `CREATE DATABASE IF NOT EXISTS \`${dbname}\``;

                adminConn.query(createDbSql, (err) => {
                    if (err) {
                        console.error('Error creating database:', err);
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    }

                    const createUserSql = `CREATE USER IF NOT EXISTS '${username}'@'localhost' IDENTIFIED BY '${password}'`;
                    const grantPrivilegesSql = `GRANT ALL PRIVILEGES ON \`${dbname}\`.* TO '${username}'@'localhost'`;

                    adminConn.query(createUserSql, (err) => {
                        if (err) {
                            console.error('Error creating user:', err);
                            res.status(500).json({ error: 'Internal Server Error' });
                            return;
                        }

                        adminConn.query(grantPrivilegesSql, (err) => {
                            if (err) {
                                console.error('Error granting privileges:', err);
                                res.status(500).json({ error: 'Internal Server Error' });
                                return;
                            }

                            adminConn.changeUser({ database: dbname }, (err) => {
                                if (err) {
                                    console.error('Error switching database:', err);
                                    res.status(500).json({ error: 'Internal Server Error' });
                                    return;
                                }

                                const createTableSql = `
                                    CREATE TABLE IF NOT EXISTS clientInfo (
                                        ID INT AUTO_INCREMENT PRIMARY KEY,
                                        firstName VARCHAR(255),
                                        lastName VARCHAR(255),
                                        email VARCHAR(255),
                                        phone VARCHAR(20),
                                        address VARCHAR(255)
                                    )
                                `;

                                adminConn.query(createTableSql, (err) => {
                                    if (err) {
                                        console.error('Error creating table:', err);
                                        res.status(500).json({ error: 'Internal Server Error' });
                                        return;
                                    }

                                    res.sendFile(path.join(__dirname, "../views/authorised-client.html"));
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Route for handling login requests
router.post("/login", async (req, res) => {
    try {

        
        const { username, password } = req.body;
        const sql = `SELECT * FROM ClientData WHERE ClientUsername = ? AND ClientPassword = ?`;

        const masterDbConnection = mysql.createConnection(masterDbConfig);

        masterDbConnection.connect((err) => {
            if (err) {
                console.error('Error connecting to MasterDB:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            masterDbConnection.query(sql, [username, password], (err, results) => {
                if (err) {
                    console.error('Error querying MasterDB:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                if (results.length === 1) {
                    const userData = results[0];


                    //Upon successful authentication, the user's data retrieved from the database is stored 
                    //in the session for future use. If only one result is returned from the database query 
                    //(`results.length === 1`), the user's data is extracted from the first result (`results[0]`). 
                    //The user's database configuration is then extracted from this data and stored in the session as 
                    //`req.session.userDbConfig`.

                    //This code snippet handles user authentication and redirects the user to the dashboard upon successful login.

                    // Store user data and database config in session
                    req.session.userData = userData;
                    const userDbConfig = {
                        host: masterDbConfig.host,
                        user: userData.ClientUsername,
                        password: userData.ClientPassword,
                        database: userData.DatabaseName
                    };

                    // Store user data in session
                    req.session.userData = {
                        ClientUsername: userData.ClientUsername,
                        DatabaseName: userData.DatabaseName,
                        ClientPassword: userData.ClientPassword,
                        GoogleClientId: userData.GoogleClientId,
                        GoogleClientSecret: userData.GoogleClientSecret,
                        RedirectUri: userData.RedirectUri,
                        
                    };
                    
                    req.session.userDbConfig = userDbConfig;

                    // Redirect user after successful login
                    res.redirect('/dashboard');
                } else {
                    
                                // On Unsuccessful login: Html error page
                                res.sendFile(path.join(__dirname, "../views/login-error.html"));

                }
            });
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;