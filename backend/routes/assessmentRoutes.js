const express      = require('express');
const router       = express.Router();
const Assessment   = require('../models/assessment');
const { auth }     = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const list = await Assessment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Error fetching assessments' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { totalScore, maxScore, recommendation, level } = req.body;
    const a = await Assessment.create({
      userId: req.user.id, totalScore,
      maxScore: maxScore || 30, recommendation, level,
    });
    res.status(201).json({ message: 'Assessment saved', assessment: a });
  } catch (err) {
    console.error('ASSESSMENT ERROR:', err.message);
    res.status(500).json({ message: 'Error saving assessment' });
  }
});

module.exports = router;
