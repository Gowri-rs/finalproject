const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const User     = require('../models/user');
const { auth } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, password, role,
      phone, supportArea, experience, language, availability,
      specialization, qualification, license, consultationFee,
    } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(400).json({ message: 'An account with this email already exists' });

    const hashed   = await bcrypt.hash(password, 10);
    const safeRole = ['user','volunteer','therapist'].includes(role) ? role : 'user';
    const needsApproval = ['volunteer','therapist'].includes(safeRole);

    await User.create({
      name: name.trim(), email: email.toLowerCase().trim(),
      password: hashed, role: safeRole,
      status: needsApproval ? 'pending' : 'approved',
      phone, supportArea, experience,
      language: language || 'English',
      availability, specialization, qualification, license, consultationFee,
    });

    res.status(201).json({
      success: true,
      message: needsApproval
        ? 'Registration successful! Your account is pending admin approval.'
        : 'Registration successful! You can now log in.',
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err.message);
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: msgs.join(', ') });
    }
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Invalid email or password' });

    if (user.status === 'pending')
      return res.status(403).json({ message: 'Your account is awaiting admin approval.' });
    if (user.status === 'rejected')
      return res.status(403).json({ message: 'Your account has been rejected. Contact support.' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,                          // ← reference uses "token"
      usertoken: token,               // ← keep old key too for compatibility
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;
