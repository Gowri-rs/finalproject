const express   = require('express');
const router    = express.Router();
const Razorpay  = require('razorpay');
const crypto    = require('crypto');
const { auth }  = require('../middleware/auth');
const User      = require('../models/user');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payments/create-order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { therapistId, amount } = req.body;

    if (!therapistId || !amount) {
      return res.status(400).json({ message: 'therapistId and amount are required' });
    }

    const therapist = await User.findById(therapistId).select('-password');
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // rupees → paise
      currency: 'INR',
      receipt:  `receipt_${Date.now()}`,
      notes: {
        therapistId:   therapistId.toString(),
        therapistName: therapist.name,
        userId:        req.user.id.toString(),
      },
    });

    res.json({
      orderId:       order.id,
      amount:        order.amount,
      currency:      order.currency,
      keyId:         process.env.RAZORPAY_KEY_ID,
      therapistName: therapist.name,
    });
  } catch (err) {
    console.error('RAZORPAY ERROR:', err.message);
    res.status(500).json({ message: 'Payment initiation failed. Please try again.' });
  }
});

// POST /api/payments/verify
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body     = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed. Signature mismatch.' });
    }

    res.json({ verified: true, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error('VERIFY ERROR:', err.message);
    res.status(500).json({ message: 'Payment verification failed.' });
  }
});

module.exports = router;