const express = require('express');
const router  = express.Router();
const User    = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const therapists = await User.find({ role: 'therapist', status: 'approved' })
      .select('-password -email').sort({ createdAt: -1 });
    res.json(therapists);
  } catch {
    res.status(500).json({ message: 'Error fetching therapists' });
  }
});

module.exports = router;
