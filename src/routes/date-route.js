// routes/utils.js ou routes/date.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  res.json({ today });
});

module.exports = router;
