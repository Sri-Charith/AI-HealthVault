const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: String,
  calories: Number
});

const dietSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // 'YYYY-MM-DD'
    required: true
  },
  foodItems: [foodItemSchema],
  dailyTarget: {
    type: Number,
    default: 2000
  }
});

module.exports = mongoose.model('Diet', dietSchema);
