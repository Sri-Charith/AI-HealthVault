// import React, { useState, useEffect } from 'react';
// import { Pie } from 'react-chartjs-2';
// import axios from 'axios';
// import 'chart.js/auto';
// import '../App.css';

// const Diet = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
//   const [dailyTarget, setDailyTarget] = useState(2000);
//   const [newTarget, setNewTarget] = useState('');
//   const [foodItem, setFoodItem] = useState('');
//   const [foodLog, setFoodLog] = useState([]);
//   const [remaining, setRemaining] = useState(0);
//   const [message, setMessage] = useState('');
//   const [setForMonth, setSetForMonth] = useState(false);

//   const token = localStorage.getItem('token');

//   const fetchFoodLog = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/diet/${selectedDate}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const data = res.data;
//       setFoodLog(data.foodItems || []);
//       setDailyTarget(data.dailyTarget || 2000);

//       const total = data.foodItems?.reduce((acc, item) => acc + item.calories, 0) || 0;
//       const rem = (data.dailyTarget || 2000) - total;

//       setRemaining(rem);
//       setMessage(rem <= 0 ? '🎉 Goal reached!' : '🥗 Keep going!');
//     } catch (err) {
//       console.error('Error fetching food log:', err);
//       setFoodLog([]);
//       setRemaining(dailyTarget);
//       setMessage('⚠️ Failed to fetch food log.');
//     }
//   };

//   useEffect(() => {
//     fetchFoodLog();
//   }, [selectedDate]);

//   const handleAddFood = async (e) => {
//     e.preventDefault();
//     if (!foodItem) return;

//     try {
//       await axios.post('http://localhost:5000/api/diet/add', {
//         foodItem,
//         date: selectedDate
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setFoodItem('');
//       fetchFoodLog();
//     } catch (err) {
//       console.error('Error adding food:', err);
//     }
//   };

//   const handleSetTarget = async () => {
//     try {
//       await axios.post('http://localhost:5000/api/diet/target', {
//         target: Number(newTarget),
//         date: selectedDate,
//         setForMonth
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setNewTarget('');
//       setSetForMonth(false);
//       fetchFoodLog();
//     } catch (err) {
//       console.error('Error setting target:', err);
//     }
//   };

//   const chartData = {
//     labels: foodLog.map(item => item.name),
//     datasets: [{
//       data: foodLog.map(item => item.calories),
//       backgroundColor: ['#81c784', '#aed581', '#c8e6c9', '#4caf50', '#2e7d32'],
//     }]
//   };

//   return (
//     <div className="container mt-4 diet-wrapper">
//       <h2 className="text-success mb-3 animated">🥗 Daily Diet Tracker</h2>

//       <div className="card p-4 shadow-sm mb-4">
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label className="form-label">📅 Select Date</label>
//             <input
//               type="date"
//               className="form-control"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">🔥 Set Daily Calorie Target</label>
//             <div className="input-group">
//               <input
//                 type="number"
//                 className="form-control"
//                 placeholder="e.g. 1800"
//                 value={newTarget}
//                 onChange={(e) => setNewTarget(e.target.value)}
//               />
//               <button className="btn btn-outline-success" onClick={handleSetTarget}>Set</button>
//             </div>
//             <div className="form-check mt-2">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={setForMonth}
//                 onChange={() => setSetForMonth(!setForMonth)}
//                 id="monthCheckbox"
//               />
//               <label className="form-check-label" htmlFor="monthCheckbox">
//                 Apply to entire month
//               </label>
//             </div>
//           </div>
//         </div>

//         <h5 className="mt-3">🎯 Target: {dailyTarget} kcal</h5>
//         <h6 className={remaining <= 0 ? 'text-success' : 'text-warning'}>
//           🧮 Remaining: {remaining} kcal
//         </h6>
//         <p>{message}</p>

//         <form onSubmit={handleAddFood} className="mt-3">
//           <input
//             type="text"
//             className="form-control mb-2"
//             placeholder="Enter food item (e.g., Rice)"
//             value={foodItem}
//             onChange={e => setFoodItem(e.target.value)}
//             required
//           />
//           <button className="btn btn-success w-100">Add Food</button>
//         </form>
//       </div>

//       {foodLog.length > 0 && (
//         <div className="mb-5">
//           <h5>📊 Calorie Breakdown</h5>
//           <Pie data={chartData} />

//           <h5 className="mt-4">📋 Food Log for {selectedDate}</h5>
//           <div className="row mt-3">
//             {foodLog.map((item, index) => (
//               <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-3">
//                 <div className="card shadow-sm p-3 h-100">
//                   <h6 className="mb-1">{item.name}</h6>
//                   <p className="mb-0 text-muted">Calories: {item.calories} kcal</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Diet;


import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import '../styles/diet.css'; // Custom CSS for styling
import toast from 'react-hot-toast';
const Diet = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [dailyTarget, setDailyTarget] = useState(2000);
  const [newTarget, setNewTarget] = useState('');
  const [foodItem, setFoodItem] = useState('');
  const [foodLog, setFoodLog] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [message, setMessage] = useState('');
  const [setForMonth, setSetForMonth] = useState(false);

  const token = localStorage.getItem('token');

  const fetchFoodLog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/diet/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data;
      setFoodLog(data.foodItems || []);
      setDailyTarget(data.dailyTarget || 2000);

      const total = data.foodItems?.reduce((acc, item) => acc + item.calories, 0) || 0;
      const rem = (data.dailyTarget || 2000) - total;

      setRemaining(rem<=0 ? 0 : rem);
      setMessage(rem <= 0 ? '🎉 Goal reached!' : '🥗 Keep going!');
    } catch (err) {
      console.error('Error fetching food log:', err);
      setFoodLog([]);
      setRemaining(dailyTarget);
      setMessage('⚠️ Failed to fetch food log.');
    }
  };

  useEffect(() => {
    fetchFoodLog();
  }, [selectedDate]);

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!foodItem) return;

    try {
      await axios.post('http://localhost:5000/api/diet/add', {
        foodItem,
        date: selectedDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFoodItem('');
      toast.success('Food item added successfully!');
      fetchFoodLog();
    } catch (err) {
      console.error('Error adding food:', err);
    }
  };

  const handleSetTarget = async () => {
    try {
      await axios.post('http://localhost:5000/api/diet/target', {
        target: Number(newTarget),
        date: selectedDate,
        setForMonth
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewTarget('');
      toast.success('Daily target set successfully!');
      setSetForMonth(false);
      fetchFoodLog();
    } catch (err) {
      console.error('Error setting target:', err);
    }
  };

  const chartData = {
    labels: foodLog.map(item => item.name),
    datasets: [{
      data: foodLog.map(item => item.calories),
      backgroundColor: ['#81c784', '#aed581', '#c8e6c9', '#4caf50', '#2e7d32'],
    }]
  };
  return (
    <div className="container-lg mt-4 diet-wrapper">
      <h2 className="text-success mb-4 text-center fw-bold">🥗 Daily Diet Tracker</h2>

      <div className="card p-3 p-md-4 shadow-lg mb-4">
        <div className="row g-3">
          {/* Date Picker */}
          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                id="dateInput"
              />
              <label htmlFor="dateInput" className="text-muted">📅 Select Date</label>
            </div>
          </div>

          {/* Target Setting */}
          <div className="col-12 col-md-6">
            <div className="d-flex flex-column h-100">
              <div className="input-group flex-nowrap">
                <span className="input-group-text">🔥 Target</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Calories"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={handleSetTarget}
                  disabled={!newTarget}
                >
                  Set
                </button>
              </div>
              <div className="form-check mt-2 ms-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={setForMonth}
                  onChange={() => setSetForMonth(!setForMonth)}
                  id="monthCheckbox"
                />
                <label className="form-check-label small" htmlFor="monthCheckbox">
                  Apply to entire month
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="row mt-4 g-3 text-center">
          <div className="col-6 col-md-4">
            <div className="p-3 bg-light rounded-3">
              <h6 className="mb-0 text-secondary small">Daily Target</h6>
              <h3 className="mb-0 fw-bold">{dailyTarget}</h3>
              <small className="text-muted">kcal</small>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className={`p-3 ${remaining <= 0 ? 'bg-success-light' : 'bg-warning-light'} rounded-3`}>
              <h6 className="mb-0 text-secondary small">Remaining</h6>
              <h3 className="mb-0 fw-bold">{remaining}</h3>
              <small className="text-muted">kcal</small>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 bg-info-light rounded-3">
              <h6 className="mb-0 text-secondary small">Status</h6>
              <p className="mb-0 lead">{message}</p>
            </div>
          </div>
        </div>

        {/* Add Food Form */}
        <form onSubmit={handleAddFood} className="mt-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter food item (e.g., Chicken Breast)"
              value={foodItem}
              onChange={e => setFoodItem(e.target.value)}
              required
            />
            <button className="btn btn-success px-4">
              Add Food <span className="ms-2 d-none d-md-inline">➕</span>
            </button>
          </div>
        </form>
      </div>

      {/* Chart and Food Log */}
      {foodLog.length > 0 && (
        <div className="mb-5">
          <div className="card p-3 p-md-4 shadow-lg mt-4">
            <h4 className="mb-3">📊 Calorie Breakdown</h4>
            <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
              <Pie
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </div>

          <div className="card p-3 p-md-4 shadow-lg mt-4">
            <h4 className="mb-3">📋 Food Log for {selectedDate}</h4>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
              {foodLog.map((item, index) => (
                <div key={index} className="col">
                  <div className="card shadow-sm h-100 hover-shadow">
                    <div className="card-body">
                      <h5 className="card-title mb-1">{item.name}</h5>
                      <p className="card-text text-success fw-bold">
                        {item.calories} kcal
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diet;