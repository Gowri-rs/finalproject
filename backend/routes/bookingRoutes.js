const express    = require('express');
const router     = express.Router();
const Booking    = require('../models/booking');
const { auth }   = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { personId, personType, userName, date, time, paymentIntentId, amountPaid, paymentStatus } = req.body;
    if (!personId || !personType || !date)
      return res.status(400).json({ message: 'personId, personType and date are required' });
    const b = await Booking.create({
      userId: req.user.id, personId, personType, userName, date, time,
      paymentIntentId: paymentIntentId || '',
      amountPaid:      amountPaid      || 0,
      paymentStatus:   paymentStatus   || 'unpaid',
    });
    res.status(201).json({ message: 'Booking confirmed!', booking: b });
  } catch (err) {
    console.error('BOOKING ERROR:', err.message);
    res.status(500).json({ message: 'Booking failed. Please try again.' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const list = await Booking.find({ userId: req.user.id })
      .populate('personId', 'name role specialization supportArea')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

module.exports = router;
