const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalScore:     { type: Number, required: true },
  maxScore:       { type: Number, default: 30 },
  recommendation: String,
  level:          { type: String, enum: ['mild','moderate','severe'] },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
