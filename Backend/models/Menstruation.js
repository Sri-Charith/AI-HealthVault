// models/Menstruation.js
const mongoose = require('mongoose');

const menstruationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastPeriodDate: { type: Date, required: true }
});

module.exports = mongoose.model('Menstruation', menstruationSchema);