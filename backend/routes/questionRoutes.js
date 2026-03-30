const express            = require('express');
const router             = express.Router();
const Question           = require('../models/question');
const { auth, adminAuth} = require('../middleware/auth');

// GET /api/questions — public, returns active questions (for assessment)
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true }).sort({ order: 1 });
    res.json(questions);
  } catch {
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// GET /api/questions/all — admin only, returns all questions including inactive
router.get('/all', auth, adminAuth, async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 });
    res.json(questions);
  } catch {
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// POST /api/questions — admin only, create a question
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { order, question, imageKey, options, isActive } = req.body;
    if (!question || !options || options.length < 2)
      return res.status(400).json({ message: 'Question text and at least 2 options are required' });

    const q = await Question.create({ order: order || 0, question, imageKey: imageKey || '', options, isActive: isActive !== false });
    res.status(201).json({ message: 'Question created', question: q });
  } catch (err) {
    console.error('CREATE QUESTION ERROR:', err.message);
    res.status(500).json({ message: 'Error creating question' });
  }
});

// PUT /api/questions/:id — admin only, update a question
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { order, question, imageKey, options, isActive } = req.body;
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { order, question, imageKey, options, isActive },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question updated', question: updated });
  } catch (err) {
    console.error('UPDATE QUESTION ERROR:', err.message);
    res.status(500).json({ message: 'Error updating question' });
  }
});

// DELETE /api/questions/:id — admin only, delete a question
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch {
    res.status(500).json({ message: 'Error deleting question' });
  }
});

module.exports = router;
