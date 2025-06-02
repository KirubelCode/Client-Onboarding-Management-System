const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const router = express.Router();

let clientData = {}; // In-memory temporary store

// Replace this with your utility import if needed
function establishUserDbConnection(config) {
    return mysql.createConnection(config);
}

// Route to select a clients data
router.get("/selectclient", (req, res) => {
    const clientId = req.query.id;
    const userDbConfig = req.session.userDbConfig;

    if (!userDbConfig) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const connection = establishUserDbConnection(userDbConfig);

    connection.connect((err) => {
        if (err) {
            console.error("DB connection error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const sql = `SELECT * FROM clientInfo WHERE id = ?`;
        connection.query(sql, [clientId], (err, result) => {
            if (err) {
                console.error("Query error:", err);
                res.status(500).json({ error: "Internal Server Error" });
            } else {
                res.json(result[0] || {});
            }

            connection.end();
        });
    });
});

// Route to add a client
router.post("/addClient", (req, res) => {
    const userDbConfig = req.session.userDbConfig;
    if (!userDbConfig) return res.status(401).json({ error: "Unauthorized" });

    const { firstName, lastName, email, phone, address } = req.body;
    const connection = mysql.createConnection(userDbConfig);
    connection.connect();

    const sql = `INSERT INTO clientInfo (firstName, lastName, phone, address, email) VALUES (?, ?, ?, ?, ?)`;
    const values = [firstName, lastName, phone, address, email];

    connection.query(sql, values, (err) => {
        if (err) {
            console.error("Insert failed:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.sendFile(path.join(__dirname, "../views/client-added.html"));
        }

        connection.end();
    });
});

// Creates client data
router.post("/setClientData", (req, res) => {
    const { email, phone, address, firstName, lastName } = req.body;
    clientData = { email, phone, address, firstName, lastName };
    res.json({ message: "Client data updated successfully" });
});

// Retrieves client data
router.get("/getClientData", (req, res) => {
    res.json(clientData);
});

// Update client
router.post("/updateclient", (req, res) => {
    const { clientId, firstName, lastName, email, phone, address } = req.body;
    const userDbConfig = req.session.userDbConfig;
    if (!userDbConfig) return res.status(401).json({ error: 'Unauthorized' });

    const connection = mysql.createConnection(userDbConfig);
    connection.connect();

    const sql = `UPDATE clientInfo SET firstName = ?, lastName = ?, email = ?, phone = ?, address = ? WHERE id = ?`;
    const values = [firstName, lastName, email, phone, address, clientId];

    connection.query(sql, values, (err) => {
        if (err) {
            console.error('Update failed:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('Client updated successfully');
        }

        connection.end();
    });
});

// Deletes client data and esnures successful deletion.
router.post('/deleteClient', (req, res) => {
    const userDbConfig = req.session.userDbConfig;

    if (!userDbConfig) {
        res.status(401).json({ error: 'User not authenticated or database configuration missing' });
        return;
    }

    const userDbConnection = establishUserDbConnection(userDbConfig);

    const clientId = req.body.clientId; // Extract clientId from request body

    if (!clientId) {
        res.status(400).json({ error: 'Client ID missing in request' });
        return;
    }

    userDbConnection.connect((err) => {
        if (err) {
            console.error('Error connecting to user database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const sql = 'DELETE FROM clientInfo WHERE ID = ?';
        const values = [clientId];

        userDbConnection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error deleting client:', err);
                res.status(500).json({ error: 'Error deleting client' });
            } else {
                if (result.affectedRows > 0) {
                    // Client deleted successfully
                    res.status(200).json({ message: 'Client deleted successfully' });
                } else {
                    // Client not found or deletion unsuccessful
                    res.status(404).json({ error: 'Client not found or deletion unsuccessful' });
                }
            }

            userDbConnection.end(); // Close the database connection
        });
    });
});


module.exports = router;
