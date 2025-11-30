// models/Fitness.js
const mongoose = require('mongoose');

const exerciseSetSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, default: 0 }, // Weight in kg/lbs (0 for bodyweight)
  restTime: { type: Number, default: 60 } // Rest time in seconds
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['push', 'pull', 'legs', 'core', 'cardio'],
    required: true 
  },
  sets: [exerciseSetSchema],
  notes: { type: String, default: '' }
});

const fitnessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  stepsWalked: { type: Number, default: 0 },
  target: { type: Number, default: 1000 },
  fixedMonthly: { type: Boolean, default: false },
  workoutType: { 
    type: String, 
    enum: ['push', 'pull', 'legs', 'rest', 'cardio', 'full-body'],
    default: 'cardio' 
  },
  exercises: [exerciseSchema],
  totalVolume: { type: Number, default: 0 }, // Total weight lifted (sum of sets * reps * weight)
  workoutDuration: { type: Number, default: 0 } // Duration in minutes
});

module.exports = mongoose.model('Fitness', fitnessSchema);