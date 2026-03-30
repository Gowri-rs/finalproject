const express    = require('express');
const router     = express.Router();
const Groq       = require('groq-sdk');
const { auth }   = require('../middleware/auth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || process.env.API_KEY });

router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      messages: [
        { role: 'system', content: 'You are MindBloom Assistant, a compassionate mental wellness companion. Be warm, empathetic, and supportive. Keep responses concise (2-4 sentences) and conversational.' },
        { role: 'user', content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error('CHATBOT ERROR:', err.message);
    res.status(500).json({ message: 'Chatbot unavailable. Please try again.' });
  }
});

module.exports = router;
