require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/question');
const connectDB = require('./db');

const DEFAULT_QUESTIONS = [
  {
    order: 1,
    question: 'How do you usually feel when starting your day?',
    imageKey: 'morning',
    options: [
      { text: 'Fresh and ready', score: 0 },
      { text: 'Need time to settle', score: 1 },
      { text: 'Some mornings feel heavy', score: 2 },
      { text: 'Often difficult to begin', score: 3 },
      { text: 'Mentally tired already', score: 4 },
      { text: 'Even getting up feels overwhelming', score: 5 },
    ],
  },
  {
    order: 2,
    question: 'How do daily responsibilities affect you lately?',
    imageKey: 'responsibilities',
    options: [
      { text: 'I manage comfortably', score: 0 },
      { text: 'Some tasks need extra effort', score: 1 },
      { text: 'I feel pressured often', score: 2 },
      { text: 'Tasks drain my energy', score: 3 },
      { text: 'Small tasks feel exhausting', score: 4 },
      { text: 'I struggle with basic tasks', score: 5 },
    ],
  },
  {
    order: 3,
    question: 'How often do you feel emotionally disconnected?',
    imageKey: 'disconnected',
    options: [
      { text: 'Rarely', score: 0 },
      { text: 'Sometimes briefly', score: 1 },
      { text: 'During stressful days', score: 2 },
      { text: 'Quite often lately', score: 3 },
      { text: 'Most days feel distant', score: 4 },
      { text: 'Almost always detached', score: 5 },
    ],
  },
  {
    order: 4,
    question: 'How is your sleep experience recently?',
    imageKey: 'sleep',
    options: [
      { text: 'Restful and refreshing', score: 0 },
      { text: 'Wake up once or twice', score: 1 },
      { text: 'Some nights restless', score: 2 },
      { text: 'Often interrupted', score: 3 },
      { text: 'Wake up tired frequently', score: 4 },
      { text: 'Sleep rarely refreshes me', score: 5 },
    ],
  },
  {
    order: 5,
    question: 'How do you react to unexpected problems?',
    imageKey: 'stress',
    options: [
      { text: 'I stay calm', score: 0 },
      { text: 'Need a moment to adjust', score: 1 },
      { text: 'Creates some tension', score: 2 },
      { text: 'I worry a lot', score: 3 },
      { text: 'Affects my whole day', score: 4 },
      { text: 'Feels hard to cope', score: 5 },
    ],
  },
  {
    order: 6,
    question: 'How connected do you feel with people around you?',
    imageKey: 'connection',
    options: [
      { text: 'Very connected', score: 0 },
      { text: 'Mostly comfortable', score: 1 },
      { text: 'Sometimes distant', score: 2 },
      { text: 'Often isolated', score: 3 },
      { text: 'Emotionally withdrawn', score: 4 },
      { text: 'Almost completely disconnected', score: 5 },
    ],
  },
];

async function seed() {
  await connectDB();
  const count = await Question.countDocuments();
  if (count === 0) {
    await Question.insertMany(DEFAULT_QUESTIONS);
    console.log('✅ Default questions seeded');
  } else {
    console.log(`ℹ️  ${count} questions already exist, skipping seed`);
  }
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
