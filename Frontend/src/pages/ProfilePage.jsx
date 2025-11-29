import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Chart as ChartJS, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { FaUser, FaEnvelope, FaLock, FaChartBar, FaCalendar } from 'react-icons/fa';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [timeFilter, setTimeFilter] = useState('weekly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch user data
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);

        // Fetch progress data
        const progressRes = await axios.get('http://localhost:5000/api/auth/progress', {
          headers: { Authorization: `Bearer ${token}` },
          params: { range: timeFilter }
        });
        setProgressData(progressRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [timeFilter]);

  const getChartData = (category) => {
    return {
      labels: progressData[category]?.labels || [],
      datasets: [{
        label: 'Completion Rate (%)',
        data: progressData[category]?.data || [],
        backgroundColor: '#28a745',
        borderColor: '#218838',
        borderWidth: 1
      }]
    };
  };

  if (!user) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      {/* User Info Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0"><FaUser className="me-2" />User Information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><FaUser className="me-2" /> <strong>Username:</strong> {user.username}</p>
              <p><FaEnvelope className="me-2" /> <strong>Email:</strong> {user.email}</p>
            </div>
            <div className="col-md-6">
              <Link to="/reset-password" className="btn btn-outline-success">
                <FaLock className="me-2" /> Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0"><FaChartBar className="me-2" />Health Preferences</h5>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            {user.goals.map(goal => (
              <span key={goal} className="badge bg-success">
                {goal}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      {/* <div className="card shadow-sm">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0"><FaChartBar className="me-2" />Health Progress</h5>
          <select 
            className="form-select w-auto" 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="card-body">
          <div className="row g-4">
            {user.goals.filter(g => g !== 'Overall').map(goal => (
              <div className="col-12 col-md-6" key={goal}>
                <div className="card h-100">
                  <div className="card-header">
                    <h6 className="mb-0">{goal} Progress</h6>
                  </div>
                  <div className="card-body">
                    {progressData[goal] ? (
                      <Bar 
                        data={getChartData(goal)}
                        options={{ 
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: { y: { max: 100 } }
                        }}
                        height={300}
                      />
                    ) : (
                      <p className="text-muted">No progress data available</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProfilePage;