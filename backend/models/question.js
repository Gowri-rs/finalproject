const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text:  { type: String, required: true },
  score: { type: Number, required: true, min: 0, max: 5 },
}, { _id: true });

const questionSchema = new mongoose.Schema({
  order:    { type: Number, required: true },
  question: { type: String, required: true },
  imageKey: { type: String, default: '' }, // key to pick illustration on frontend
  options:  { type: [optionSchema], required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
