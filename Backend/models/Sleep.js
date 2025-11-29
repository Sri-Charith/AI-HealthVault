const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  wakeTime: String,
  sleepTime: String
});

module.exports = mongoose.model('Sleep', sleepSchema);
