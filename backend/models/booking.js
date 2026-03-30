const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personType:      { type: String, enum: ['volunteer','therapist'], required: true },
  userName:        String,
  date:            { type: String, required: true },
  time:            String,
  status:          { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
  paymentStatus:   { type: String, enum: ['unpaid','paid','refunded'], default: 'unpaid' },
  paymentIntentId: { type: String, default: '' },
  amountPaid:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
