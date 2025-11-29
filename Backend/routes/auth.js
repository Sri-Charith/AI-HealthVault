const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { signup, login } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgot-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});
  
// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user goals
router.put('/update-goals', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { goals: req.body.goals },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user progress
router.get('/progress', verifyToken, async (req, res) => {
    try {
      const { range } = req.query;
      const progressData = {};
  
      // Example for fitness progress - implement similar for other categories
      const fitnessData = await Fitness.aggregate([
        { $match: { userId: req.user.id } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          completed: { $avg: { $cond: ["$completed", 1, 0] } }
        }},
        { $sort: { _id: 1 } },
        { $limit: range === 'weekly' ? 7 : 30 }
      ]);
  
      progressData.Fitness = {
        labels: fitnessData.map(d => d._id),
        data: fitnessData.map(d => Math.round(d.completed * 100))
      };
  
      res.json(progressData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching progress data' });
    }
  });
  
  

module.exports = router;
