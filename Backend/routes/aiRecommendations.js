// routes/aiRecommendations.js
const express = require('express');
const router = express.Router();
const { getAIRecommendations } = require('../utils/geminiService');
const auth = require('../middleware/authMiddleware');
const Diet = require('../models/Diet');
const Sleep = require('../models/Sleep');
const Fitness = require('../models/Fitness');
const Medication = require('../models/Medication');
const User = require('../models/User');
const moment = require('moment');

// Get AI recommendations for diet
router.get('/diet', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || moment().format('YYYY-MM-DD');
    
    // Get diet data - Diet model uses 'user' field
    // Try both _id and id since diet routes use req.user.id
    const diet = await Diet.findOne({ 
      $or: [
        { user: req.user._id },
        { user: req.user.id }
      ],
      date: targetDate 
    });
    const totalCalories = diet?.foodItems?.reduce((sum, item) => sum + (item.calories || 0), 0) || 0;
    const dailyTarget = diet?.dailyTarget || 2000;
    
    const dietData = {
      dailyTarget,
      totalCalories,
      remaining: dailyTarget - totalCalories,
      foodItems: diet?.foodItems || []
    };
    
    // Get user profile
    const user = await User.findById(req.user._id).select('goals');
    
    const recommendations = await getAIRecommendations('diet', dietData, {
      goals: user?.goals || []
    });
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Error getting diet recommendations:', error);
    res.status(500).json({ message: error.message || 'Failed to get AI recommendations' });
  }
});

// Get AI recommendations for sleep
router.get('/sleep', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = moment(date || new Date()).startOf('day').toDate();
    
    // Get sleep data
    const userId = req.user._id || req.user.id;
    const sleep = await Sleep.findOne({ userId: userId, date: targetDate });
    
    let duration = 0;
    if (sleep?.wakeTime && sleep?.sleepTime) {
      const wake = moment(sleep.wakeTime, 'HH:mm');
      const sleepTime = moment(sleep.sleepTime, 'HH:mm');
      if (wake.isBefore(sleepTime)) {
        wake.add(1, 'day');
      }
      duration = wake.diff(sleepTime, 'hours', true);
    }
    
    const sleepData = {
      duration: duration.toFixed(1),
      bedtime: sleep?.sleepTime || null,
      wakeTime: sleep?.wakeTime || null,
      monthlyGoal: 7 * 30 // Default 7 hours per day
    };
    
    // Get user profile
    const user = await User.findById(req.user._id).select('goals');
    
    const recommendations = await getAIRecommendations('sleep', sleepData, {
      goals: user?.goals || []
    });
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Error getting sleep recommendations:', error);
    res.status(500).json({ message: error.message || 'Failed to get AI recommendations' });
  }
});

// Get AI recommendations for fitness
router.get('/fitness', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || moment().format('YYYY-MM-DD');
    
    // Get fitness data
    const userId = req.user._id || req.user.id;
    const fitness = await Fitness.findOne({ userId: userId, date: targetDate });
    
    const fitnessData = {
      stepsWalked: fitness?.stepsWalked || 0,
      target: fitness?.target || 1000,
      workoutType: fitness?.workoutType || null,
      totalVolume: fitness?.totalVolume || 0,
      exercises: fitness?.exercises || []
    };
    
    // Get user profile
    const user = await User.findById(req.user._id).select('goals');
    
    const recommendations = await getAIRecommendations('fitness', fitnessData, {
      goals: user?.goals || []
    });
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Error getting fitness recommendations:', error);
    res.status(500).json({ message: error.message || 'Failed to get AI recommendations' });
  }
});

// Get AI recommendations for medication
router.get('/medication', auth, async (req, res) => {
  try {
    // Get medication data
    const userId = req.user._id || req.user.id;
    const medications = await Medication.find({ userId: userId });
    
    const stockData = medications.map(med => ({
      name: med.tabletName,
      stockQuantity: med.stockQuantity || 0,
      tabletsPerDose: med.tabletsPerDose || 1,
      frequency: med.frequency,
      estimatedRefillDate: med.estimatedRefillDate,
      times: med.times
    }));
    
    const medicationData = {
      medications: medications,
      stockData: stockData
    };
    
    // Get user profile
    const user = await User.findById(req.user._id).select('goals');
    
    const recommendations = await getAIRecommendations('medication', medicationData, {
      goals: user?.goals || []
    });
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Error getting medication recommendations:', error);
    res.status(500).json({ message: error.message || 'Failed to get AI recommendations' });
  }
});

module.exports = router;

