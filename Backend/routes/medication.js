const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');
const authMiddleware = require('../middleware/authMiddleware');

// Add a medication
// Mark a tablet time as taken
router.post('/mark-taken', authMiddleware, async (req, res) => {
    const { tabletId, time } = req.body;
    console.log(req.body);
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
    try {
      await Medication.updateOne(
        { _id: tabletId, userId: req.user.id },
        { $push: { takenLog: { date, time } } }
      );
      res.status(200).json({ msg: "Marked as taken" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error marking as taken" });
    }
  });
  

// Get medications for user
router.get('/', authMiddleware, async (req, res) => {
  const meds = await Medication.find({ userId: req.user.id });
  res.json(meds);
});
// Add a new medication
router.post('/', authMiddleware, async (req, res) => {
    const { tabletName, times, startDate, frequency } = req.body;
  console.log(req.body);
    if (!tabletName || !times || times.length === 0 || !startDate || !frequency) {
      return res.status(400).json({ msg: "All fields are required" });
    }
  
    try {
      const newMed = new Medication({
        userId: req.user.id,
        tabletName,
        times,
        startDate,
        frequency,
        takenLog: [],
      });
  
      await newMed.save();
      res.status(201).json({ msg: "Medication added", medication: newMed });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error adding medication" });
    }
  });
  

module.exports = router;
