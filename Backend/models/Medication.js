const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tabletName: { type: String, required: true },
  times: [String],
  startDate: { type: Date },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'], // ✅ Add your allowed values here
    required: true,
  },
  takenLog: [
    {
      date: String, // 'YYYY-MM-DD'
      time: String, // 'HH:MM'
    },
  ],
});

module.exports = mongoose.model('Medication', medicationSchema);
