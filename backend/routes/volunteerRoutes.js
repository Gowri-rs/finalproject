const express = require('express');
const router  = express.Router();
const User    = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer', status: 'approved' })
      .select('-password -email').sort({ createdAt: -1 });
    res.json(volunteers);
  } catch {
    res.status(500).json({ message: 'Error fetching volunteers' });
  }
});

module.exports = router;
