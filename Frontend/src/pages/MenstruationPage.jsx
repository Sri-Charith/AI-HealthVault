// // --- Frontend (React + Bootstrap) ---
// // pages/MenstruationPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const MenstruationPage = () => {
//   const [lastPeriodDate, setLastPeriodDate] = useState('');
//   const [nextPeriod, setNextPeriod] = useState(null);
//   const [showArrivedPrompt, setShowArrivedPrompt] = useState(false);

//   // 🔐 Fetch token from localStorage
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/menstruation', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         if (res.data?.lastPeriodDate) {
//           const date = moment(res.data.lastPeriodDate);
//           setLastPeriodDate(date.format('YYYY-MM-DD'));
//           const next = date.clone().add(30, 'days');
//           setNextPeriod(next);

//           const diff = moment().diff(next, 'days');
//           if (diff >= 0 && diff <= 3) {
//             setShowArrivedPrompt(true);
//           }
//         }
//       })
//       .catch((err) => {
//         console.error('Error fetching menstruation data:', err.message);
//       });
//   }, [token]);

//   const handleSubmit = async () => {
//     try {
//       await axios.post(
//         'http://localhost:5000/api/menstruation',
//         { lastPeriodDate },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert('Updated successfully!');
//     } catch (err) {
//       console.error('Error updating date:', err.message);
//       alert('Something went wrong while updating.');
//     }
//   };

//   const handleConfirmArrival = async () => {
//     const today = moment().format('YYYY-MM-DD');
//     setLastPeriodDate(today);

//     try {
//       await axios.post(
//         'http://localhost:5000/api/menstruation',
//         { lastPeriodDate: moment().toISOString() },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setShowArrivedPrompt(false);
//       alert('Period date updated. Stay strong ❤️');
//     } catch (err) {
//       console.error('Error confirming arrival:', err.message);
//       alert('Error confirming period arrival.');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="card shadow rounded p-4">
//         <h3 className="mb-4 text-danger">🩸 Menstruation Tracker</h3>

//         <div className="mb-3">
//           <label className="form-label fw-bold">Last Period Date</label>
//           <input
//             type="date"
//             className="form-control"
//             value={lastPeriodDate}
//             onChange={(e) => setLastPeriodDate(e.target.value)}
//           />
//         </div>

//         <button className="btn btn-danger" onClick={handleSubmit}>
//           Update Date
//         </button>

//         {nextPeriod && (
//           <div className="alert alert-info mt-4">
//             Your next expected period is on:{' '}
//             <strong>{nextPeriod.format('MMMM D, YYYY')}</strong>
//           </div>
//         )}

//         {showArrivedPrompt && (
//           <div className="alert alert-warning mt-4">
//             <h5>🩸 Is your period started today?</h5>
//             <button
//               className="btn btn-outline-danger mt-2"
//               onClick={handleConfirmArrival}
//             >
//               Yes, update to today
//             </button>
//           </div>
//         )}

//         <div className="mt-5 text-center text-muted">
//           <p>
//             <i>“Taking care of yourself is part of loving yourself.”</i>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenstruationPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-hot-toast';
import "../styles/menstruation.css"; // Custom CSS for styling
const MenstruationPage = () => {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [nextPeriod, setNextPeriod] = useState(null);
  const [showArrivedPrompt, setShowArrivedPrompt] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/menstruation', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data?.lastPeriodDate) {
          const date = moment(res.data.lastPeriodDate);
          setLastPeriodDate(date.format('YYYY-MM-DD'));
          calculateNextPeriod(date);
        }
      } catch (err) {
        toast.error('Error fetching cycle data');
      }
    };
    fetchData();
  }, [token]);

  const calculateNextPeriod = (date) => {
    const next = date.clone().add(30, 'days');
    setNextPeriod(next);
    const diff = moment().diff(next, 'days');
    setShowArrivedPrompt(diff >= 0 && diff <= 3);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/menstruation',
        { lastPeriodDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      calculateNextPeriod(moment(lastPeriodDate));
      toast.success('Cycle date updated successfully!');
    } catch (err) {
      toast.error('Failed to update date');
    }
  };

  const handleConfirmArrival = async () => {
    const today = moment().format('YYYY-MM-DD');
    try {
      await axios.post(
        'http://localhost:5000/api/menstruation',
        { lastPeriodDate: today },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLastPeriodDate(today);
      calculateNextPeriod(moment(today));
      setShowArrivedPrompt(false);
      toast.success('Period start recorded. Take care ❤️');
    } catch (err) {
      toast.error('Error updating period date');
    }
  };

  return (
    <div className="container-lg py-4 px-3 px-sm-4">
      <div className="card shadow-lg border-danger">
        <div className="card-header bg-danger text-white">
          <h3 className="mb-0">🩸 Menstrual Cycle Tracker</h3>
        </div>

        <div className="card-body">
          {/* Date Input Section */}
          <div className="row g-3 align-items-end mb-4">
            <div className="col-12 col-md-8">
              <label className="form-label fw-semibold">Last Period Start Date</label>
              <input
                type="date"
                className="form-control form-control-lg"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <button 
                className="btn btn-danger w-100 py-2"
                onClick={handleSubmit}
                disabled={!lastPeriodDate}
              >
                Update Cycle
              </button>
            </div>
          </div>

          {/* Cycle Information */}
          {nextPeriod && (
            <div className="card bg-light border-danger mb-4">
              <div className="card-body">
                <h5 className="text-danger d-flex align-items-center gap-2">
                  <i className="bi bi-calendar-heart"></i>
                  Next Expected Period
                </h5>
                <p className="lead mb-0">
                  {nextPeriod.format('dddd, MMMM D, YYYY')}
                </p>
              </div>
            </div>
          )}

          {/* Arrival Prompt */}
          {showArrivedPrompt && (
            <div className="card border-warning mb-4">
              <div className="card-body">
                <h5 className="text-warning d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle"></i>
                  Cycle Update Needed
                </h5>
                <p>Has your period started?</p>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleConfirmArrival}
                >
                  Yes, mark as started today
                </button>
              </div>
            </div>
          )}

          {/* Inspiration Quote */}
          <div className="text-center mt-5">
            <blockquote className="fst-italic text-muted">
              “Self-care is how you take your power back.”
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenstruationPage;