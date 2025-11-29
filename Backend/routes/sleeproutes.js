const express = require('express');
const router = express.Router();
const Sleep = require('../models/Sleep');
const  verifyToken  = require('../middleware/authMiddleware');
const moment = require('moment');

// Set sleep times
router.post('/set', verifyToken, async (req, res) => {
  try {
    const { wakeTime, sleepTime, date, applyToMonth } = req.body;
    const baseDate = moment(date);

    if (applyToMonth) {
      const start = baseDate.clone().startOf('month');
      const end = baseDate.clone().endOf('month');

      for (let m = moment(start); m <= end; m.add(1, 'days')) {
        const currentDate = m.clone().startOf('day').toDate();
        let entry = await Sleep.findOne({ userId: req.user.id, date: currentDate });
        if (!entry) entry = new Sleep({ userId: req.user.id, date: currentDate });

        entry.wakeTime = wakeTime;
        entry.sleepTime = sleepTime;
        await entry.save();
      }
      return res.status(200).json({ msg: 'Sleep schedule set for the month' });
    }

    const sleepDate = baseDate.startOf('day').toDate();
    let entry = await Sleep.findOne({ userId: req.user.id, date: sleepDate });
    if (!entry) entry = new Sleep({ userId: req.user.id, date: sleepDate });

    entry.wakeTime = wakeTime;
    entry.sleepTime = sleepTime;
    await entry.save();
    res.status(200).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to set sleep schedule' });
  }
});

// Get sleep by date
router.get('/by-date/:date', verifyToken, async (req, res) => {
  try {
    const date = moment(req.params.date).startOf('day').toDate();
    const entry = await Sleep.findOne({ userId: req.user.id, date });
    res.status(200).json(entry || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to get sleep schedule' });
  }
});


// In your /by-date route
router.get('/by-date/:date', verifyToken, async (req, res) => {
  try {
    const date = moment(req.params.date).startOf('day').toDate();
    const entry = await Sleep.findOne({ userId: req.user.id, date });
    
    // Return default structure if no entry found
    const responseData = entry || { 
      wakeTime: '07:00', 
      sleepTime: '22:00',
      date: req.params.date
    };
    
    res.status(200).json(responseData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get sleep schedule' });
  }
});
module.exports = router;
