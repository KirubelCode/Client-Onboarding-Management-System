const express = require('express');
const path = require('path');
const router = express.Router();

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout failed:', err);
      return res.status(500).send('Logout error');
    }
    res.sendFile(path.join(__dirname, '../views/logout.html'));
  });
});

module.exports = router;
