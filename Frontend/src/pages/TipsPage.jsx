import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaAppleAlt,
  FaBed,
  FaDumbbell,
  FaPills,
  FaCalendarAlt
} from 'react-icons/fa';
import '../styles/tipspage.css';

const TipsPage = () => {
  const [userGoals, setUserGoals] = useState([]);
  const [tips, setTips] = useState({
    Diet: [
      'Drink 8 glasses of water daily',
      'Include protein in every meal',
      'Limit processed foods',
      'Eat 5 servings of vegetables daily'
    ],
    Sleep: [
      'Maintain consistent sleep schedule',
      'Avoid screens 1 hour before bed',
      'Keep bedroom dark and cool',
      'Limit caffeine after 2 PM'
    ],
    Fitness: [
      'Warm up before exercising',
      'Aim for 150 mins exercise weekly',
      'Mix cardio and strength training',
      'Listen to your body for recovery'
    ],
    Medication: [
      'Set phone reminders for doses',
      'Use pill organizer',
      'Keep medication list updated',
      'Store meds properly'
    ],
    Menstruation: [
      'Track cycle symptoms',
      'Stay hydrated during period',
      'Use heat pads for cramps',
      'Maintain iron-rich diet'
    ]
  });

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserGoals(res.data.goals);
      } catch (err) {
        console.error('Error fetching goals:', err);
      }
    };
    fetchGoals();
  }, []);

  const getIcon = (category) => {
    const iconClass = "tip-card-icon";
    switch (category) {
      case 'Diet':
        return <FaAppleAlt className={iconClass} />;
      case 'Sleep':
        return <FaBed className={iconClass} />;
      case 'Fitness':
        return <FaDumbbell className={iconClass} />;
      case 'Medication':
        return <FaPills className={iconClass} />;
      case 'Menstruation':
        return <FaCalendarAlt className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div className="tips-container">
      <h2 className="tips-header">Health Tips</h2>

      {userGoals.includes('Overall') ? (
        Object.entries(tips).map(([category, categoryTips]) => (
          <div key={category} className="tip-card">
            <div className="tip-card-header">
              {getIcon(category)}
              {category} Tips
            </div>
            <ul className="tip-list">
              {categoryTips.map((tip, i) => (
                <li key={i} className="tip-list-item">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        userGoals.map((goal) => (
          <div key={goal} className="tip-card">
            <div className="tip-card-header">
              {getIcon(goal)}
              {goal} Tips
            </div>
            <ul className="tip-list">
              {tips[goal]?.map((tip, i) => (
                <li key={i} className="tip-list-item">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {userGoals.length === 0 && (
        <div className="no-goals-alert">
          No health goals selected yet. Update your preferences to see relevant tips!
        </div>
      )}
    </div>
  );
};

export default TipsPage;
