const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const router = express.Router();

router.get('/manually-input', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/manually-input.html'));
});

router.post("/addClient", (req, res) => {
    const userDbConfig = req.session.userDbConfig;
    if (!userDbConfig) return res.status(401).json({ error: 'Unauthorized' });

    const { firstName, lastName, email, phone, address } = req.body;
    const connection = mysql.createConnection(userDbConfig);
    connection.connect();

    const sql = `INSERT INTO clientInfo (firstName, lastName, phone, address, email) VALUES (?, ?, ?, ?, ?)`;
    const values = [firstName, lastName, phone, address, email];

    connection.query(sql, values, (err) => {
        if (err) {
            console.error('Insert failed:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(`
                <script>
                    alert('Client added successfully');
                    window.history.back();
                </script>
            `);
        }

        connection.end();
    });
});

module.exports = router;
