import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SleepPage() {
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('22:00');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [applyToMonth, setApplyToMonth] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const token = localStorage.getItem('token');

  // Fetch existing sleep data when date changes
  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/sleep/by-date/${date}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.wakeTime) setWakeTime(res.data.wakeTime);
        if (res.data.sleepTime) setSleepTime(res.data.sleepTime);
      } catch (err) {
        console.error('Error fetching sleep data:', err);
      }
    };

    fetchSleepData();
    fetchAIRecommendations();
  }, [date, token]);

  const fetchAIRecommendations = async () => {
    if (!token) return;
    setLoadingAI(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/ai-recommendations/sleep?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiRecommendations(res.data.recommendations || '');
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
      setAiRecommendations('');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/api/sleep/set', {
        wakeTime,
        sleepTime,
        date,
        applyToMonth
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Sleep schedule saved!');
      toast.success('Sleep schedule saved!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      fetchAIRecommendations(); // Refresh AI recommendations
    } catch (err) {
      toast.error('Failed to save sleep schedule', {
        position: "top-center"
      });
      console.error('Save error:', err);
    }
  };

  return (
    <div className="sleep-container">
      <div className="card sleep-card">
        <h1 className="page-title">🌙 Sleep Schedule Tracker</h1>

        <div className="form-group">
          <label>📅 Select Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="time-inputs">
          <div className="time-group">
            <label>⏰ Wake Up Time</label>
            <input
              type="time"
              className="form-control"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
            />
          </div>

          <div className="time-group">
            <label>😴 Bed Time</label>
            <input
              type="time"
              className="form-control"
              value={sleepTime}
              onChange={e => setSleepTime(e.target.value)}
            />
          </div>
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={applyToMonth}
              onChange={() => setApplyToMonth(!applyToMonth)}
            />
            Apply to entire month
          </label>
        </div>

        <button
          className="save-button"
          onClick={handleSave}
        >
          💾 Save Schedule
        </button>
      </div>

      {/* AI Recommendations Card */}
      <div className="card sleep-card mt-4" style={{ border: '2px solid #4299e1' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="page-title mb-0" style={{ fontSize: '1.5rem' }}>🤖 AI Recommendations</h3>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={fetchAIRecommendations}
            disabled={loadingAI}
          >
            {loadingAI ? '🔄 Loading...' : '🔄 Refresh'}
          </button>
        </div>
        {loadingAI ? (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Getting AI recommendations...</p>
          </div>
        ) : aiRecommendations ? (
          <div className="alert alert-info mb-0">
            <div style={{ whiteSpace: 'pre-wrap' }}>{aiRecommendations}</div>
          </div>
        ) : (
          <div className="text-center text-muted py-3">
            <p>Click refresh to get personalized AI recommendations based on your sleep data!</p>
          </div>
        )}
      </div>
    </div>
  );
}