// models/Fitness.js
const mongoose = require('mongoose');

const fitnessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  stepsWalked: { type: Number, default: 0 },
  target: { type: Number, default: 1000 },
  fixedMonthly: { type: Boolean, default: false }
});

module.exports = mongoose.model('Fitness', fitnessSchema);