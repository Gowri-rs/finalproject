const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:        { type: String, required: true },
  role:            { type: String, enum: ['user','volunteer','therapist','admin'], default: 'user' },
  status:          { type: String, enum: ['pending','approved','rejected'], default: 'approved' },
  // volunteer fields
  phone:           String,
  supportArea:     String,
  experience:      String,
  language:        { type: String, default: 'English' },
  availability:    String,
  // therapist fields
  specialization:  String,
  qualification:   String,
  license:         String,
  consultationFee: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
