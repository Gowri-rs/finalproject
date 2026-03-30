const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const { auth } = require('../middleware/auth');

// Create a booking (without payment)
router.post('/add', auth, async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      userId: req.user.id,
      paymentStatus: 'unpaid', // payment pending
    });
    res.json({ status: 'ok', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Failed to create booking' });
  }
});

// Get all bookings for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('personId', 'userName');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch bookings' });
  }
});

module.exports = router;