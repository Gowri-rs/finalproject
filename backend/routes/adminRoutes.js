const express                = require('express');
const router                 = express.Router();
const User                   = require('../models/user');
const { auth, adminAuth }    = require('../middleware/auth');

router.use(auth, adminAuth);

// GET /api/admin/pending-users
router.get('/pending-users', async (req, res) => {
  try {
    const users = await User.find({ status: 'pending', role: { $in: ['volunteer','therapist'] } })
      .select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Error fetching pending users' });
  }
});

// PUT /api/admin/approve/:id
router.put('/approve/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} has been approved`, user });
  } catch {
    res.status(500).json({ message: 'Error approving user' });
  }
});

// PUT /api/admin/reject/:id
router.put('/reject/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} has been rejected`, user });
  } catch {
    res.status(500).json({ message: 'Error rejecting user' });
  }
});

module.exports = router;
