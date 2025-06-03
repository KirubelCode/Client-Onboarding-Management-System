const express = require("express");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const router = express.Router();


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

router.get('/getClientData', (req, res) => {
  const data = req.session.clientData;
  if (!data) return res.status(404).json({ error: 'No client data found' });
  res.json(data);
  console.log("Sending client data:", clientData);

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

// GET: Manage Clients Page

// GET: Manage Clients Page
router.get("/manage-clients", async (req, res) => {
  const userDbConfig = req.session.userDbConfig;
  if (!userDbConfig) return res.status(401).send("Not authenticated");

  const conn = establishUserDbConnection(userDbConfig);
  conn.connect();

  conn.query("SELECT * FROM clientInfo", (err, results) => {
    if (err) {
      conn.end();
      return res.status(500).send("DB error");
    }

    const clientOptions = results.map(c => `<option value="${c.ID}">${c.firstName} ${c.lastName}</option>`).join('');
    const clientDetails = JSON.stringify(
      results.reduce((obj, c) => {
        obj[c.ID] = c;
        return obj;
      }, {})
    );

    fs.readFile(path.join(__dirname, "../views/manage-clients.html"), "utf8", (err, html) => {
      if (err) {
        conn.end();
        return res.status(500).send("Could not load HTML");
      }

      html = html.replace("<!-- Insert ${clientOptions} here from server -->", clientOptions);
      html = html.replace("const clientDetails = {};", `const clientDetails = ${clientDetails};`);

      res.send(html);
      conn.end();
    });
  });
});

// GET: Search Clients Page
router.get("/searchClientsPage", (req, res) => {
  fs.readFile(path.join(__dirname, "../views/search-clients.html"), "utf8", (err, html) => {
    if (err) return res.status(500).send("Could not load search page");
    res.send(html);
  });
});

// POST: Search Logic
router.post("/searchClientAddress", (req, res) => {
  const { keyword } = req.body;
  const config = req.session.userDbConfig;
  if (!config) return res.status(401).send("Unauthorized");

  const conn = establishUserDbConnection(config);
  conn.connect();

  conn.query("SELECT * FROM clientInfo WHERE address LIKE ?", [`%${keyword}%`], (err, rows) => {
    conn.end();
    if (err) return res.status(500).send("DB Error");

    if (rows.length === 0) return res.send("<p>No clients found.</p>");

    const html = rows.map(c => `
      <div>
        <b>${c.firstName} ${c.lastName}</b><br>
        ${c.email}<br>
        ${c.phone}<br>
        ${c.address}
        <hr>
      </div>
    `).join("");

    res.send(html);
  });
});


// POST: Search Logic
router.post("/searchClientAddress", (req, res) => {
    const { keyword } = req.body;
    const config = req.session.userDbConfig;
    if (!config) return res.status(401).send("Unauthorized");

    const conn = establishUserDbConnection(config);
    conn.connect();
    conn.query("SELECT * FROM clientInfo WHERE address LIKE ?", [`%${keyword}%`], (err, rows) => {
        if (err) return res.status(500).send("DB Error");

        let html = "";
        rows.forEach(c => {
            html += `<div><b>${c.firstName} ${c.lastName}</b><br>${c.email}<br>${c.phone}<br>${c.address}<hr></div>`;
        });
        res.send(html || "<p>No clients found.</p>");
        conn.end();
    });
});

module.exports = router;
