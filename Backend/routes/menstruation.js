// routes/menstruation.js
const express = require('express');
const router = express.Router();
const Menstruation = require('../models/Menstruation');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

// Save or update menstruation data
router.post('/', authMiddleware, async (req, res) => {
    const { lastPeriodDate } = req.body;
    try {
      let entry = await Menstruation.findOne({ userId: req.user.id });
      if (entry) {
        entry.lastPeriodDate = lastPeriodDate;
        await entry.save();
      } else {
        await Menstruation.create({ userId: req.user.id, lastPeriodDate });
      }
      res.status(200).json({ msg: 'Menstruation data saved.' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
  // Get current data
  router.get('/', authMiddleware, async (req, res) => {
    const data = await Menstruation.findOne({ userId: req.user.id });
    res.json(data);
  });
  
  module.exports = router;
  