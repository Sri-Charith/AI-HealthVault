import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import {
  LineChart,
  Line,
  BarChart,
  Bar as RechartsBar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import "../styles/fitness.css"; // Normal CSS
import toast from 'react-hot-toast';
import { FaDumbbell, FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, ChartLegend);

const FitnessTracker = () => {
  const [fitness, setFitness] = useState(null);
  const [steps, setSteps] = useState(0);
  const [monthly, setMonthly] = useState([]);
  const [targetInput, setTargetInput] = useState('');
  const [useMonthly, setUseMonthly] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [workoutType, setWorkoutType] = useState('');
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseCategory, setExerciseCategory] = useState('push');
  const [exerciseSets, setExerciseSets] = useState([{ reps: 10, weight: 0, restTime: 60 }]);
  const [exerciseNotes, setExerciseNotes] = useState('');
  const [editingExercise, setEditingExercise] = useState(null);
  const token = localStorage.getItem('token');

  // Common exercises by category
  const commonExercises = {
    push: ['Push-ups', 'Bench Press', 'Shoulder Press', 'Dips', 'Tricep Extensions', 'Chest Flyes'],
    pull: ['Pull-ups', 'Chin-ups', 'Rows', 'Lat Pulldowns', 'Bicep Curls', 'Face Pulls'],
    legs: ['Squats', 'Deadlifts', 'Lunges', 'Leg Press', 'Leg Curls', 'Calf Raises'],
    core: ['Plank', 'Crunches', 'Sit-ups', 'Russian Twists', 'Leg Raises', 'Mountain Climbers']
  };

  const fetchToday = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/fitness?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFitness(res.data);
      setTargetInput(res.data?.target || '');
      setWorkoutType(res.data?.workoutType || '');
    } catch (error) {
      console.error('Error fetching fitness data:', error);
      toast.error('Failed to load fitness data');
    }
  };

  const fetchMonthly = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/fitness/monthly', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthly(res.data || []);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      setMonthly([]);
    }
  };

  const setTarget = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/fitness/set-target',
        { 
          target: parseInt(targetInput), 
          useForMonth: useMonthly,
          date: selectedDate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Target ${useMonthly ? 'for month' : ''} updated successfully!`);
      fetchToday();
      fetchMonthly(); // Refresh monthly data
    } catch (error) {
      toast.error('Failed to update target');
    }
  };

  const updateSteps = async () => {
    const stepsValue = parseInt(steps);
    if (!stepsValue || stepsValue <= 0) {
      toast.error('Please enter a valid number of steps');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/fitness/update',
        { steps: stepsValue, date: selectedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSteps(0);
      fetchToday();
      fetchMonthly(); // Refresh monthly data
      toast.success('Steps added successfully!');
    } catch (error) {
      toast.error('Failed to add steps');
    }
  };

  useEffect(() => {
    fetchToday();
    fetchMonthly();
  }, [selectedDate]);

  const setWorkoutTypeHandler = async (type) => {
    if (!token) {
      toast.error('Please login again');
      return;
    }
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/fitness/set-workout-type',
        { workoutType: type, date: selectedDate },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      setWorkoutType(type);
      fetchToday();
      toast.success(`Workout type set to ${type.toUpperCase()}`);
    } catch (error) {
      console.error('Error setting workout type:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to set workout type';
      toast.error(errorMessage);
    }
  };

  const addSet = () => {
    setExerciseSets([...exerciseSets, { reps: 10, weight: 0, restTime: 60 }]);
  };

  const removeSet = (index) => {
    setExerciseSets(exerciseSets.filter((_, i) => i !== index));
  };

  const updateSet = (index, field, value) => {
    const newSets = [...exerciseSets];
    const numValue = value === '' || value === null || value === undefined 
      ? (field === 'weight' ? 0 : '') 
      : Number(value);
    newSets[index][field] = isNaN(numValue) ? (field === 'weight' ? 0 : '') : numValue;
    setExerciseSets(newSets);
  };

  const quickAddExercise = (name, category) => {
    setExerciseName(name);
    setExerciseCategory(category);
    setExerciseSets([{ reps: 10, weight: 0, restTime: 60 }]);
    setShowExerciseForm(true);
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login again');
      return;
    }
    
    if (!exerciseName || !exerciseName.trim()) {
      toast.error('Please enter an exercise name');
      return;
    }
    
    if (exerciseSets.length === 0) {
      toast.error('Please add at least one set');
      return;
    }
    
    // Validate and clean sets
    let cleanedSets;
    try {
      cleanedSets = exerciseSets.map((set, i) => {
        const reps = Number(set.reps);
        const weight = Number(set.weight) || 0;
        const restTime = Number(set.restTime) || 60;
        
        if (!reps || isNaN(reps) || reps <= 0) {
          throw new Error(`Set ${i + 1}: Please enter valid reps (positive number)`);
        }
        if (weight < 0 || isNaN(weight)) {
          throw new Error(`Set ${i + 1}: Weight must be a non-negative number`);
        }
        
        return { reps, weight, restTime };
      });
    } catch (validationError) {
      toast.error(validationError.message);
      return;
    }

    try {
      if (editingExercise) {
        await axios.put(
          `http://localhost:5000/api/fitness/exercise/${editingExercise}`,
          { sets: cleanedSets, notes: exerciseNotes.trim(), date: selectedDate },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        toast.success('Exercise updated!');
      } else {
        await axios.post(
          'http://localhost:5000/api/fitness/add-exercise',
          {
            exerciseName: exerciseName.trim(),
            category: exerciseCategory,
            sets: cleanedSets,
            notes: exerciseNotes.trim(),
            date: selectedDate
          },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        toast.success('Exercise added!');
      }
      
      resetExerciseForm();
      fetchToday();
      fetchMonthly(); // Refresh monthly data for charts
    } catch (error) {
      console.error('Error saving exercise:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save exercise';
      toast.error(errorMessage);
    }
  };

  const resetExerciseForm = () => {
    setExerciseName('');
    setExerciseCategory('push');
    setExerciseSets([{ reps: 10, weight: 0, restTime: 60 }]);
    setExerciseNotes('');
    setShowExerciseForm(false);
    setEditingExercise(null);
  };

  const editExercise = (exercise) => {
    setExerciseName(exercise.name);
    setExerciseCategory(exercise.category);
    setExerciseSets(exercise.sets);
    setExerciseNotes(exercise.notes || '');
    setEditingExercise(exercise._id);
    setShowExerciseForm(true);
  };

  const deleteExercise = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;
    
    try {
      await axios.delete(
        `http://localhost:5000/api/fitness/exercise/${exerciseId}?date=${selectedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Exercise deleted!');
      fetchToday();
      fetchMonthly(); // Refresh monthly data
    } catch (error) {
      toast.error('Failed to delete exercise');
    }
  };

  const getExercisesByCategory = (category) => {
    if (!fitness || !fitness.exercises) return [];
    return fitness.exercises.filter(ex => ex.category === category);
  };

  // Prepare data for Recharts strength training visualizations
  const prepareVolumeData = () => {
    if (!monthly || monthly.length === 0) return [];
    return monthly.map(day => ({
      date: moment(day.date).format('MMM D'),
      volume: day.totalVolume || 0,
      exercises: day.exercises?.length || 0
    }));
  };

  const prepareCategoryVolumeData = () => {
    if (!fitness || !fitness.exercises) return [];
    const categoryVolumes = { push: 0, pull: 0, legs: 0, core: 0 };
    
    fitness.exercises.forEach(exercise => {
      const exerciseVolume = exercise.sets.reduce((total, set) => {
        return total + (set.reps * (set.weight || 0));
      }, 0);
      if (categoryVolumes.hasOwnProperty(exercise.category)) {
        categoryVolumes[exercise.category] += exerciseVolume;
      }
    });

    return [
      { name: 'Push', value: categoryVolumes.push, color: '#ef5350' },
      { name: 'Pull', value: categoryVolumes.pull, color: '#42a5f5' },
      { name: 'Legs', value: categoryVolumes.legs, color: '#66bb6a' },
      { name: 'Core', value: categoryVolumes.core, color: '#ab47bc' }
    ].filter(item => item.value > 0);
  };

  const prepareExerciseVolumeData = () => {
    if (!fitness || !fitness.exercises) return [];
    return fitness.exercises.map(exercise => {
      const volume = exercise.sets.reduce((total, set) => {
        return total + (set.reps * (set.weight || 0));
      }, 0);
      return {
        name: exercise.name.length > 15 ? exercise.name.substring(0, 15) + '...' : exercise.name,
        volume: volume,
        sets: exercise.sets.length,
        category: exercise.category
      };
    }).sort((a, b) => b.volume - a.volume);
  };

  const prepareWorkoutTypeData = () => {
    if (!monthly || monthly.length === 0) return [];
    const workoutCounts = { push: 0, pull: 0, legs: 0, rest: 0, cardio: 0 };
    
    monthly.forEach(day => {
      if (day.workoutType && workoutCounts.hasOwnProperty(day.workoutType)) {
        workoutCounts[day.workoutType]++;
      }
    });

    return [
      { name: 'Push', value: workoutCounts.push, color: '#ef5350' },
      { name: 'Pull', value: workoutCounts.pull, color: '#42a5f5' },
      { name: 'Legs', value: workoutCounts.legs, color: '#66bb6a' },
      { name: 'Rest', value: workoutCounts.rest, color: '#9e9e9e' },
      { name: 'Cardio', value: workoutCounts.cardio, color: '#ffa726' }
    ].filter(item => item.value > 0);
  };

  const remaining = fitness ? fitness.target - fitness.stepsWalked : 0;

  const barData = {
    labels: monthly.map((d) => moment(d.date).format('D MMM')),
    datasets: [
      {
        label: 'Steps Walked',
        backgroundColor: '#4CAF50',
        data: monthly.map((d) => d.stepsWalked),
      },
    ],
  };

  const remainingData = {
    labels: monthly.map((d) => moment(d.date).format('D MMM')),
    datasets: [
      {
        label: 'Remaining Steps',
        backgroundColor: '#FF5722',
        data: monthly.map((d) => Math.max(d.target - d.stepsWalked, 0)),
      },
    ],
  };
  return (
    <div className="container-fluid px-3 px-lg-5 py-4">
      <h2 className="text-center mb-4 display-5 fw-bold text-success">
        <FaDumbbell className="me-2" /> Fitness Tracker
      </h2>

      {/* Date Selector and Workout Type in one row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <label className="form-label fw-semibold mb-2">📅 Select Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="mb-3 fw-bold">🏋️ Workout Type (Push-Pull Scheme)</h6>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`btn btn-sm ${workoutType === 'push' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setWorkoutTypeHandler('push')}
                >
                  🔴 Push
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${workoutType === 'pull' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setWorkoutTypeHandler('pull')}
                >
                  🔵 Pull
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${workoutType === 'legs' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setWorkoutTypeHandler('legs')}
                >
                  🟢 Legs
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${workoutType === 'rest' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setWorkoutTypeHandler('rest')}
                >
                  ⚪ Rest
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${workoutType === 'cardio' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setWorkoutTypeHandler('cardio')}
                >
                  🟡 Cardio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Steps Tracking */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">🚶 Steps Tracking</h5>
            </div>
            <div className="card-body">
              {fitness ? (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Daily Target:</label>
                    <div className="input-group mb-2">
                      <input
                        type="number"
                        className="form-control"
                        value={targetInput}
                        onChange={(e) => setTargetInput(e.target.value)}
                        placeholder="10000"
                        min="0"
                      />
                      <button 
                        className="btn btn-primary"
                        onClick={setTarget}
                        disabled={!targetInput || targetInput <= 0}
                      >
                        Save
                      </button>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={useMonthly}
                        onChange={(e) => setUseMonthly(e.target.checked)}
                        id="monthlyTargetCheck"
                      />
                      <label className="form-check-label small" htmlFor="monthlyTargetCheck">
                        Apply to entire month
                      </label>
                    </div>
                  </div>

                  <div className={`alert ${remaining > 0 ? 'alert-warning' : 'alert-success'} mb-3`}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Steps: {fitness.stepsWalked || 0} / {fitness.target || 1000}</strong>
                        <br />
                        <small>{remaining > 0 ? `Remaining: ${remaining}` : '🎉 Goal Achieved!'}</small>
                      </div>
                      <div className="text-end">
                        <div className="progress" style={{ width: '60px', height: '60px' }}>
                          <div 
                            className={`progress-bar ${remaining > 0 ? 'bg-warning' : 'bg-success'}`}
                            role="progressbar"
                            style={{ 
                              width: `${Math.min(100, ((fitness.stepsWalked || 0) / (fitness.target || 1000)) * 100)}%`,
                              height: '100%'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="input-group">
                    <input
                      type="number"
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                      className="form-control"
                      placeholder="Add steps"
                      min="1"
                    />
                    <button 
                      className="btn btn-success"
                      onClick={updateSteps}
                      disabled={!steps || steps <= 0}
                    >
                      ➕ Add
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-3">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exercise Logging */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">💪 Strength Training</h5>
              <button
                className="btn btn-light btn-sm"
                onClick={() => setShowExerciseForm(!showExerciseForm)}
              >
                <FaPlus className="me-1" /> {showExerciseForm ? 'Cancel' : 'Add Exercise'}
              </button>
            </div>
            <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {/* Exercise Form */}
              {showExerciseForm && (
                <div className="card border-primary mb-4">
                  <div className="card-body">
                    <form onSubmit={handleAddExercise}>
                      <div className="row g-3 mb-3">
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">Exercise Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            placeholder="e.g., Push-ups"
                            required
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">Category</label>
                          <select
                            className="form-select"
                            value={exerciseCategory}
                            onChange={(e) => setExerciseCategory(e.target.value)}
                            required
                          >
                            <option value="push">Push</option>
                            <option value="pull">Pull</option>
                            <option value="legs">Legs</option>
                            <option value="core">Core</option>
                          </select>
                        </div>
                      </div>

                      {/* Quick Add Buttons */}
                      <div className="mb-3">
                        <small className="text-muted d-block mb-2">Quick Add:</small>
                        <div className="d-flex flex-wrap gap-2">
                          {commonExercises[exerciseCategory]?.map((ex) => (
                            <button
                              key={ex}
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => quickAddExercise(ex, exerciseCategory)}
                            >
                              {ex}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sets */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="form-label fw-semibold mb-0">Sets</label>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={addSet}
                          >
                            <FaPlus className="me-1" /> Add Set
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered">
                            <thead>
                              <tr>
                                <th>Set</th>
                                <th>Reps</th>
                                <th>Weight (kg)</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exerciseSets.map((set, index) => (
                                <tr key={index}>
                                  <td className="align-middle">{index + 1}</td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      placeholder="Reps"
                                      value={set.reps || ''}
                                      onChange={(e) => updateSet(index, 'reps', e.target.value)}
                                      min="1"
                                      required
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      placeholder="Weight"
                                      value={set.weight || ''}
                                      onChange={(e) => updateSet(index, 'weight', e.target.value)}
                                      min="0"
                                      step="0.5"
                                    />
                                  </td>
                                  <td className="align-middle">
                                    {exerciseSets.length > 1 && (
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeSet(index)}
                                      >
                                        <FaTrash />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Notes (Optional)</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={exerciseNotes}
                          onChange={(e) => setExerciseNotes(e.target.value)}
                          placeholder="Any notes about this exercise..."
                        />
                      </div>

                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                          {editingExercise ? 'Update' : 'Add'} Exercise
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={resetExerciseForm}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Exercises by Category */}
              {fitness && fitness.exercises && fitness.exercises.length > 0 ? (
                <>
                  {['push', 'pull', 'legs', 'core'].map((category) => {
                    const exercises = getExercisesByCategory(category);
                    if (exercises.length === 0) return null;
                    
                    return (
                      <div key={category} className="mb-4">
                        <h6 className="text-capitalize fw-bold mb-3 d-flex align-items-center">
                          <span className="me-2">
                            {category === 'push' && '🔴'}
                            {category === 'pull' && '🔵'}
                            {category === 'legs' && '🟢'}
                            {category === 'core' && '⚪'}
                          </span>
                          {category.charAt(0).toUpperCase() + category.slice(1)} Exercises ({exercises.length})
                        </h6>
                        <div className="row g-3">
                          {exercises.map((exercise) => {
                            const exerciseVolume = exercise.sets.reduce((total, set) => {
                              return total + (set.reps * (set.weight || 0));
                            }, 0);
                            
                            return (
                              <div key={exercise._id} className="col-12 col-md-6">
                                <div className="card border h-100">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                      <h6 className="mb-0 fw-bold">{exercise.name}</h6>
                                      <div>
                                        <button
                                          className="btn btn-sm btn-outline-primary me-1"
                                          onClick={() => editExercise(exercise)}
                                          title="Edit"
                                        >
                                          <FaEdit />
                                        </button>
                                        <button
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => deleteExercise(exercise._id)}
                                          title="Delete"
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="table-responsive">
                                      <table className="table table-sm table-bordered mb-2">
                                        <thead className="table-light">
                                          <tr>
                                            <th>Set</th>
                                            <th>Reps</th>
                                            <th>Weight</th>
                                            <th>Vol</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {exercise.sets.map((set, idx) => (
                                            <tr key={idx}>
                                              <td>{idx + 1}</td>
                                              <td>{set.reps}</td>
                                              <td>{set.weight || 'BW'}</td>
                                              <td>{set.reps * (set.weight || 0)}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <small className="text-muted">
                                        <strong>Volume:</strong> {exerciseVolume.toLocaleString()} kg
                                      </small>
                                      {exercise.notes && (
                                        <small className="text-muted" title={exercise.notes}>
                                          📝
                                        </small>
                                      )}
                                    </div>
                                    {exercise.notes && (
                                      <div className="mt-2">
                                        <small className="text-muted">
                                          <strong>Notes:</strong> {exercise.notes}
                                        </small>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  
                  {fitness.totalVolume > 0 && (
                    <div className="alert alert-info mb-0">
                      <strong>📊 Total Volume: {fitness.totalVolume.toLocaleString()} kg</strong>
                    </div>
                  )}
                </>
              ) : null}

              {(!fitness || !fitness.exercises || fitness.exercises.length === 0) && (
                <div className="text-center text-muted py-4">
                  <FaDumbbell size={48} className="mb-3 opacity-50" />
                  <p>No exercises logged yet. Add your first exercise!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mt-4">
        {/* Steps Charts */}
        <div className="col-12">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3 text-primary fw-bold">📈 Monthly Steps Overview</h4>
            {monthly.length > 0 ? (
              <div className="chart-container" style={{ 
                minHeight: '300px',
                overflowX: 'auto',
                position: 'relative'
              }}>
                <Bar 
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <p>No steps data available for this month</p>
              </div>
            )}
          </div>
        </div>

        {/* Strength Training Charts with Recharts */}
        {fitness && fitness.exercises && fitness.exercises.length > 0 && (
          <div className="col-12">
            <h3 className="text-center mb-4 fw-bold text-success">💪 Strength Training Analytics</h3>
          </div>
        )}

        {/* Volume Progression Chart */}
        {prepareVolumeData().length > 0 && (
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3 text-primary fw-bold">📊 Volume Progression</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prepareVolumeData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#4caf50" 
                    strokeWidth={2}
                    name="Total Volume (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category Volume Distribution */}
        {prepareCategoryVolumeData().length > 0 && (
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3 text-primary fw-bold">🥧 Volume by Category</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={prepareCategoryVolumeData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareCategoryVolumeData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Exercise Volume Chart */}
        {prepareExerciseVolumeData().length > 0 && (
          <div className="col-12">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3 text-primary fw-bold">🏋️ Exercise Volume (Today)</h5>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={prepareExerciseVolumeData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <RechartsBar 
                    dataKey="volume" 
                    fill="#4caf50"
                    name="Volume (kg)"
                  />
                  <RechartsBar 
                    dataKey="sets" 
                    fill="#42a5f5"
                    name="Sets"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Workout Type Distribution */}
        {prepareWorkoutTypeData().length > 0 && (
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3 text-primary fw-bold">📅 Workout Type Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={prepareWorkoutTypeData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareWorkoutTypeData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Monthly Exercise Count */}
        {prepareVolumeData().length > 0 && (
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3 text-primary fw-bold">📈 Exercises Per Day</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareVolumeData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <RechartsBar 
                    dataKey="exercises" 
                    fill="#ff9800"
                    name="Number of Exercises"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessTracker;