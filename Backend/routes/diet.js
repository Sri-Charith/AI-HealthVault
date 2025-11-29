const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet');
const auth = require('../middleware/authMiddleware');
const estimateCalories = require('../utils/estimateCalorie');

// Add food item to a specific date
router.post('/add', auth, async (req, res) => {
  const { foodItem, date } = req.body;
  const day = date || new Date().toISOString().slice(0, 10);
  const calories = await estimateCalories(foodItem);

  let diet = await Diet.findOne({ user: req.user.id, date: day });

  if (!diet) {
    diet = new Diet({ user: req.user.id, date: day, foodItems: [] });
  }

  diet.foodItems.push({ name: foodItem, calories });
  await diet.save();

  res.status(201).json(diet);
});

// Get food log for a specific date
router.get('/:date', auth, async (req, res) => {
  const date = req.params.date || new Date().toISOString().slice(0, 10);
  const log = await Diet.findOne({ user: req.user.id, date });

  res.json(log || { foodItems: [], dailyTarget: 2000 });
});

// Set daily target for a specific date or for a full month
router.post('/target', auth, async (req, res) => {
  const { target, date, setForMonth } = req.body;

  if (setForMonth) {
    const month = date.slice(0, 7); // 'YYYY-MM'
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const promises = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dayStr = d.toISOString().slice(0, 10);
      promises.push(Diet.findOneAndUpdate(
        { user: req.user.id, date: dayStr },
        { $set: { dailyTarget: target } },
        { upsert: true, new: true }
      ));
    }

    await Promise.all(promises);
    return res.status(200).json({ message: 'Target set for the entire month.' });
  } else {
    const day = date || new Date().toISOString().slice(0, 10);
    const updated = await Diet.findOneAndUpdate(
      { user: req.user.id, date: day },
      { $set: { dailyTarget: target } },
      { upsert: true, new: true }
    );

    return res.status(200).json(updated);
  }
});

module.exports = router;
