const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');
const authMiddleware = require('../middleware/authMiddleware');

// Helper function to calculate estimated refill date
const calculateRefillDate = (stockQuantity, tabletsPerDose, times, frequency) => {
  if (!stockQuantity || stockQuantity === 0 || !tabletsPerDose || tabletsPerDose === 0 || !times || times.length === 0) {
    return null;
  }

  // Calculate tablets consumed per dose cycle
  const dosesPerCycle = times.length; // Number of doses per frequency cycle
  const tabletsPerCycle = dosesPerCycle * tabletsPerDose;

  // Calculate how many cycles the stock will last
  const cyclesUntilEmpty = stockQuantity / tabletsPerCycle;

  // Convert cycles to days based on frequency
  let daysUntilEmpty;
  if (frequency === 'Daily') {
    daysUntilEmpty = cyclesUntilEmpty; // 1 cycle = 1 day
  } else if (frequency === 'Weekly') {
    daysUntilEmpty = cyclesUntilEmpty * 7; // 1 cycle = 7 days
  } else if (frequency === 'Monthly') {
    daysUntilEmpty = cyclesUntilEmpty * 30; // 1 cycle = 30 days (approximate)
  } else {
    daysUntilEmpty = cyclesUntilEmpty; // Default to daily
  }

  // Calculate refill date (subtract 3 days for buffer before running out)
  const refillDate = new Date();
  refillDate.setDate(refillDate.getDate() + Math.floor(daysUntilEmpty) - 3);

  return refillDate;
};

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
    const { tabletName, times, startDate, frequency, stockQuantity, tabletsPerDose } = req.body;
  console.log(req.body);
    if (!tabletName || !times || times.length === 0 || !startDate || !frequency) {
      return res.status(400).json({ msg: "All fields are required" });
    }
  
    try {
      const estimatedRefillDate = calculateRefillDate(
        stockQuantity || 0,
        tabletsPerDose || 1,
        times,
        frequency
      );

      const newMed = new Medication({
        userId: req.user.id,
        tabletName,
        times,
        startDate,
        frequency,
        stockQuantity: stockQuantity || 0,
        tabletsPerDose: tabletsPerDose || 1,
        estimatedRefillDate,
        takenLog: [],
      });
  
      await newMed.save();
      res.status(201).json({ msg: "Medication added", medication: newMed });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error adding medication" });
    }
  });

// Update medication stock
router.put('/:id/stock', authMiddleware, async (req, res) => {
  const { stockQuantity, tabletsPerDose } = req.body;
  
  try {
    const medication = await Medication.findOne({ _id: req.params.id, userId: req.user.id });
    if (!medication) {
      return res.status(404).json({ msg: "Medication not found" });
    }

    const updatedStockQuantity = stockQuantity !== undefined ? stockQuantity : medication.stockQuantity;
    const updatedTabletsPerDose = tabletsPerDose !== undefined ? tabletsPerDose : medication.tabletsPerDose;

    const estimatedRefillDate = calculateRefillDate(
      updatedStockQuantity,
      updatedTabletsPerDose,
      medication.times,
      medication.frequency
    );

    medication.stockQuantity = updatedStockQuantity;
    medication.tabletsPerDose = updatedTabletsPerDose;
    medication.estimatedRefillDate = estimatedRefillDate;

    await medication.save();
    res.status(200).json({ msg: "Stock updated", medication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating stock" });
  }
});
  

module.exports = router;
