const express  = require('express');
const router   = express.Router();
const stripe   = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auth } = require('../middleware/auth');
const User     = require('../models/user');

// POST /api/payments/create-intent
// Creates a PaymentIntent for booking a therapist session
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { therapistId, amount } = req.body;

    if (!therapistId || !amount) {
      return res.status(400).json({ message: 'therapistId and amount are required' });
    }

    const therapist = await User.findById(therapistId).select('-password');
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

    // amount in paise (INR smallest unit)
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(amount * 100), // convert rupees to paise
      currency: 'inr',
      metadata: {
        therapistId: therapistId.toString(),
        therapistName: therapist.name,
        userId: req.user.id.toString(),
      },
      description: `MindBloom session with ${therapist.name}`,
    });

    res.json({
      clientSecret:    paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('STRIPE ERROR:', err.message);
    res.status(500).json({ message: 'Payment initiation failed. Please try again.' });
  }
});

module.exports = router;
