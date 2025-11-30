

// routes/fitness.js
const express = require('express');
const router = express.Router();
const Fitness = require('../models/Fitness');
const auth = require('../middleware/authMiddleware');
const moment = require('moment');

// Debug: Log when routes file is loaded
console.log('✅ Fitness routes loaded');

// Get fitness data for a specific date (defaults to today)
router.get('/', auth, async (req, res) => {
  try {
    const targetDate = req.query.date ? moment(req.query.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    let data = await Fitness.findOne({ userId: req.user._id, date: targetDate });

    if (!data) {
      // Use last fixedMonthly data or default
      const last = await Fitness.findOne({ userId: req.user._id }).sort({ date: -1 });
      const target = last?.fixedMonthly ? last.target : 1000;
      data = await Fitness.create({ 
        userId: req.user._id, 
        date: targetDate, 
        target,
        stepsWalked: 0,
        totalVolume: 0,
        exercises: []
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update steps walked
router.post('/update', auth, async (req, res) => {
  try {
    const { steps, date } = req.body;
    const stepsValue = parseInt(steps);
    
    if (!stepsValue || isNaN(stepsValue) || stepsValue <= 0) {
      return res.status(400).json({ message: 'Valid steps value is required' });
    }
    
    const targetDate = date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

    let data = await Fitness.findOne({ userId: req.user._id, date: targetDate });
    if (!data) {
      // Create new entry if doesn't exist
      const last = await Fitness.findOne({ userId: req.user._id }).sort({ date: -1 });
      const target = last?.fixedMonthly ? last.target : 1000;
      data = await Fitness.create({ 
        userId: req.user._id, 
        date: targetDate, 
        target, 
        stepsWalked: stepsValue 
      });
    } else {
      data.stepsWalked = (data.stepsWalked || 0) + stepsValue;
      await data.save();
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/set-target', auth, async (req, res) => {
  try {
      const { target, useForMonth, date } = req.body;
      const targetDate = moment(date || new Date());

      if (useForMonth) {
          // Handle monthly target
          const startOfMonth = targetDate.clone().startOf('month');
          const endOfMonth = targetDate.clone().endOf('month');

          // Update/create targets for each day in month
          for (let day = startOfMonth.clone(); day <= endOfMonth; day.add(1, 'day')) {
              const dateStr = day.format('YYYY-MM-DD');
              let data = await Fitness.findOne({ 
                  userId: req.user._id, 
                  date: dateStr 
              });

              if (!data) {
                  await Fitness.create({ 
                      userId: req.user._id, 
                      date: dateStr, 
                      target: parseInt(target),
                      fixedMonthly: true,
                      stepsWalked: 0,
                      totalVolume: 0,
                      exercises: []
                  });
              } else {
                  data.target = parseInt(target);
                  data.fixedMonthly = true;
                  await data.save();
              }
          }
          return res.json({ message: 'Monthly target updated successfully' });
      } else {
          // Handle single day target
          const dateStr = targetDate.format('YYYY-MM-DD');
          let data = await Fitness.findOne({ 
              userId: req.user._id, 
              date: dateStr 
          });

          if (!data) {
              data = await Fitness.create({ 
                  userId: req.user._id, 
                  date: dateStr, 
                  target: parseInt(target),
                  fixedMonthly: false,
                  stepsWalked: 0,
                  totalVolume: 0,
                  exercises: []
              });
          } else {
              data.target = parseInt(target);
              data.fixedMonthly = false;
              await data.save();
          }
          return res.json(data);
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});
  
// Get monthly data
router.get('/monthly', auth, async (req, res) => {
  try {
    const start = moment().startOf('month').format('YYYY-MM-DD');
    const end = moment().endOf('month').format('YYYY-MM-DD');

    const data = await Fitness.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 }); // Sort by date ascending

    res.json(data || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Fitness routes are working!' });
});

// Set workout type (push/pull/legs)
router.post('/set-workout-type', auth, async (req, res) => {
  try {
    const { workoutType, date } = req.body;
    
    console.log('Set workout type request:', { workoutType, date, userId: req.user._id });
    
    // Validate workout type if provided
    const validTypes = ['push', 'pull', 'legs', 'rest', 'cardio', 'full-body'];
    if (workoutType && !validTypes.includes(workoutType)) {
      return res.status(400).json({ message: `Invalid workout type. Must be one of: ${validTypes.join(', ')}` });
    }
    
    const targetDate = moment(date || new Date()).format('YYYY-MM-DD');

    let data = await Fitness.findOne({ userId: req.user._id, date: targetDate });
    if (!data) {
      const last = await Fitness.findOne({ userId: req.user._id }).sort({ date: -1 });
      const target = last?.fixedMonthly ? last.target : 1000;
      data = await Fitness.create({ 
        userId: req.user._id, 
        date: targetDate, 
        target,
        workoutType: workoutType || null,
        stepsWalked: 0,
        totalVolume: 0,
        exercises: []
      });
      console.log('Created new fitness data:', data._id);
    } else {
      data.workoutType = workoutType || null;
      await data.save();
      console.log('Updated workout type:', data.workoutType);
    }

    res.json(data);
  } catch (error) {
    console.error('Error in set-workout-type:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Add exercise
router.post('/add-exercise', auth, async (req, res) => {
  try {
    const { exerciseName, category, sets, notes, date } = req.body;
    
    console.log('Add exercise request:', { exerciseName, category, setsCount: sets?.length, userId: req.user._id });
    
    // Validation
    if (!exerciseName || !exerciseName.trim()) {
      return res.status(400).json({ message: 'Exercise name is required' });
    }
    
    if (!category || !['push', 'pull', 'legs', 'core'].includes(category)) {
      return res.status(400).json({ message: `Valid category is required. Must be one of: push, pull, legs, core` });
    }
    
    if (!sets || !Array.isArray(sets) || sets.length === 0) {
      return res.status(400).json({ message: 'At least one set is required' });
    }
    
    // Validate and clean sets
    const cleanedSets = sets.map((set, index) => {
      const reps = Number(set.reps);
      const weight = Number(set.weight) || 0;
      const restTime = Number(set.restTime) || 60;
      
      if (!reps || isNaN(reps) || reps <= 0) {
        throw new Error(`Set ${index + 1}: Invalid reps - must be a positive number`);
      }
      if (weight < 0 || isNaN(weight)) {
        throw new Error(`Set ${index + 1}: Invalid weight - must be a non-negative number`);
      }
      
      return { reps, weight, restTime };
    });
    
    const targetDate = moment(date || new Date()).format('YYYY-MM-DD');

    let data = await Fitness.findOne({ userId: req.user._id, date: targetDate });
    if (!data) {
      const last = await Fitness.findOne({ userId: req.user._id }).sort({ date: -1 });
      const target = last?.fixedMonthly ? last.target : 1000;
      data = await Fitness.create({ 
        userId: req.user._id, 
        date: targetDate, 
        target,
        stepsWalked: 0,
        totalVolume: 0,
        exercises: []
      });
      console.log('Created new fitness data for exercise:', data._id);
    }

    // Calculate volume for this exercise
    const exerciseVolume = cleanedSets.reduce((total, set) => {
      return total + (set.reps * set.weight);
    }, 0);

    const exercise = {
      name: exerciseName.trim(),
      category: category,
      sets: cleanedSets,
      notes: (notes || '').trim()
    };

    data.exercises.push(exercise);
    data.totalVolume = (data.totalVolume || 0) + exerciseVolume;
    await data.save();

    console.log('Exercise added successfully:', exercise.name);
    res.json(data);
  } catch (error) {
    console.error('Error in add-exercise:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Update exercise
router.put('/exercise/:exerciseId', auth, async (req, res) => {
  try {
    const { sets, notes, date } = req.body;
    
    if (!sets || !Array.isArray(sets) || sets.length === 0) {
      return res.status(400).json({ message: 'At least one set is required' });
    }
    
    // Validate and clean sets
    const cleanedSets = sets.map((set, index) => {
      const reps = Number(set.reps);
      const weight = Number(set.weight) || 0;
      const restTime = Number(set.restTime) || 60;
      
      if (!reps || isNaN(reps) || reps <= 0) {
        throw new Error(`Set ${index + 1}: Invalid reps`);
      }
      if (weight < 0 || isNaN(weight)) {
        throw new Error(`Set ${index + 1}: Invalid weight`);
      }
      
      return { reps, weight, restTime };
    });
    
    const targetDate = moment(date || new Date()).format('YYYY-MM-DD');

    const data = await Fitness.findOne({ userId: req.user._id, date: targetDate });
    if (!data) {
      return res.status(404).json({ message: 'Fitness data not found' });
    }

    const exercise = data.exercises.id(req.params.exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Recalculate total volume
    const oldVolume = exercise.sets.reduce((total, set) => {
      return total + (set.reps * (set.weight || 0));
    }, 0);

    const newVolume = cleanedSets.reduce((total, set) => {
      return total + (set.reps * set.weight);
    }, 0);

    exercise.sets = cleanedSets;
    if (notes !== undefined) exercise.notes = (notes || '').trim();
    data.totalVolume = Math.max(0, (data.totalVolume || 0) - oldVolume + newVolume);

    await data.save();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Delete exercise
router.delete('/exercise/:exerciseId', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = moment(date || new Date()).format('YYYY-MM-DD');

    const data = await Fitness.findOne({ userId: req.user._id, date: targetDate });
    if (!data) {
      return res.status(404).json({ message: 'Fitness data not found' });
    }

    const exercise = data.exercises.id(req.params.exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Subtract volume
    const exerciseVolume = exercise.sets.reduce((total, set) => {
      return total + (set.reps * (set.weight || 0));
    }, 0);

    data.totalVolume = Math.max(0, (data.totalVolume || 0) - exerciseVolume);
    data.exercises.pull({ _id: req.params.exerciseId });
    await data.save();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exercises by category
router.get('/exercises/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const { date } = req.query;
    const targetDate = moment(date || new Date()).format('YYYY-MM-DD');

    const data = await Fitness.findOne({ userId: req.user._id, date: targetDate });
    if (!data) {
      return res.json({ exercises: [] });
    }

    const filteredExercises = data.exercises.filter(ex => ex.category === category);
    res.json({ exercises: filteredExercises });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

