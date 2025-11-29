// // src/pages/MedicationPage.jsx
// import React, { useEffect, useState } from 'react';
// import {
//   fetchMedications,
//   addMedication,
//   markTabletAsTaken
// } from '../utils/api';
// import { FaPills, FaClock, FaCheckCircle, FaPlus, FaTrash } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const MedicationPage = () => {
//   const [medications, setMedications] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // Form States
//   const [tabletName, setTabletName] = useState('');
//   const [times, setTimes] = useState(['']);
//   const [startDate, setStartDate] = useState(new Date());
//   const [frequency, setFrequency] = useState('Daily');

//   const loadMedications = async () => {
//     try {
//       const res = await fetchMedications();
//       setMedications(res.data);
//     } catch (err) {
//       toast.error("Failed to load medications");
//     }
//   };

//   useEffect(() => {
//     loadMedications();
//   }, []);

//   const formatDate = (date) => date.toISOString().split('T')[0];
//   const todayStr = formatDate(selectedDate);

//   const handleAddTime = () => setTimes([...times, '']);

//   const handleRemoveTime = (index) =>
//     setTimes(times.filter((_, i) => i !== index));

//   const handleTimeChange = (value, index) => {
//     const newTimes = [...times];
//     newTimes[index] = value;
//     setTimes(newTimes);
//   };

//   const handleAddMedication = async (e) => {
//     e.preventDefault();
//     if (!tabletName || times.some(t => !t)) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       await addMedication({
//         tabletName,
//         times,
//         startDate,
//         frequency
//       });

//       toast.success("Medication added");
//       setTabletName('');
//       setTimes(['']);
//       setStartDate(new Date());
//       setFrequency('Daily');
//       loadMedications();
//     } catch (err) {
//       toast.error("Failed to add medication");
//     }
//   };

//   const handleMarkAsTaken = async (tabletId, time) => {
//     try {
//       await markTabletAsTaken({ tabletId, time });
//       toast.success("Marked as taken!");
//       loadMedications();
//     } catch (err) {
//       toast.error("Error marking as taken");
//     }
//   };

//   return (
//     <div className="container py-4">
//       <h2 className="text-success mb-4 text-center">💊 Medication Tracker</h2>

//       {/* Add Tablet Form */}
//       <form onSubmit={handleAddMedication} className="card p-4 shadow-sm mb-5 border border-success">
//         <h5 className="text-success mb-3 d-flex align-items-center">
//           <FaPlus className="me-2" /> Add New Medication
//         </h5>

//         <div className="mb-3">
//           <label className="form-label fw-semibold">Tablet Name</label>
//           <input
//             type="text"
//             className="form-control"
//             value={tabletName}
//             onChange={(e) => setTabletName(e.target.value)}
//             placeholder="e.g., Dolo 650"
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label fw-semibold">Times</label>
//           {times.map((time, index) => (
//             <div className="input-group mb-2" key={index}>
//               <input
//                 type="time"
//                 className="form-control"
//                 value={time}
//                 onChange={(e) => handleTimeChange(e.target.value, index)}
//                 required
//               />
//               {times.length > 1 && (
//                 <button
//                   type="button"
//                   className="btn btn-outline-danger"
//                   onClick={() => handleRemoveTime(index)}
//                 >
//                   <FaTrash />
//                 </button>
//               )}
//             </div>
//           ))}
//           <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAddTime}>
//             + Add Another Time
//           </button>
//         </div>

//         <div className="mb-3">
//           <label className="form-label fw-semibold">Start Date</label>
//           <DatePicker
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             className="form-control"
//             dateFormat="yyyy-MM-dd"
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label fw-semibold">Frequency</label>
//           <select
//             className="form-select"
//             value={frequency}
//             onChange={(e) => setFrequency(e.target.value)}
//           >
//             <option>Daily</option>
//             <option>Weekly</option>
//             <option>Monthly</option>
//           </select>
//         </div>

//         <button type="submit" className="btn btn-success mt-2">
//           <FaPills className="me-2" /> Add Medication
//         </button>
//       </form>

//       {/* Date Filter */}
//       <div className="d-flex justify-content-center mb-4">
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           className="form-control w-auto"
//           dateFormat="yyyy-MM-dd"
//         />
//       </div>

//       {/* Display Medications */}
//       <div className="row">
//         {medications.map((med) => (
//           <div className="col-md-6 col-lg-4 mb-4" key={med._id}>
//             <div className="card shadow-sm rounded-4 p-3 border border-success">
//               <h5 className="text-success d-flex align-items-center">
//                 <FaPills className="me-2" /> {med.tabletName}
//               </h5>
//               <p><strong>Frequency:</strong> {med.frequency}</p>
//               <p><strong>Start Date:</strong> {new Date(med.startDate).toDateString()}</p>

//               <div>
//                 {med.times.map((time) => {
//                   const isTaken = med.takenLog?.some(log => log.date === todayStr && log.time === time);
//                   return (
//                     <div
//                       key={time}
//                       className="d-flex justify-content-between align-items-center border p-2 rounded mb-2 bg-light"
//                     >
//                       <div className="d-flex align-items-center">
//                         <FaClock className="me-2 text-secondary" />
//                         <span className="fw-bold">{time}</span>
//                       </div>

//                       {isTaken ? (
//                         <span className="text-success d-flex align-items-center">
//                           <FaCheckCircle className="me-1" /> Taken
//                         </span>
//                       ) : (
//                         <button
//                           className="btn btn-sm btn-outline-success"
//                           onClick={() => handleMarkAsTaken(med._id, time)}
//                         >
//                           Mark as Taken
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MedicationPage;


import React, { useEffect, useState } from 'react';
import {
  fetchMedications,
  addMedication,
  markTabletAsTaken
} from '../utils/api';
import "../styles/medication.css";
import { FaPills, FaClock, FaCheckCircle, FaPlus, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const MedicationPage = () => {
  const [medications, setMedications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form States
  const [tabletName, setTabletName] = useState('');
  const [times, setTimes] = useState(['']);
  const [startDate, setStartDate] = useState(new Date());
  const [frequency, setFrequency] = useState('Daily');

  const loadMedications = async () => {
    try {
      const res = await fetchMedications();
      setMedications(res.data);
    } catch (err) {
      toast.error("Failed to load medications");
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  const formatDate = (date) => date.toISOString().split('T')[0];
  const todayStr = formatDate(selectedDate);

  const handleAddTime = () => setTimes([...times, '']);

  const handleRemoveTime = (index) =>
    setTimes(times.filter((_, i) => i !== index));

  const handleTimeChange = (value, index) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    if (!tabletName || times.some(t => !t)) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await addMedication({
        tabletName,
        times,
        startDate,
        frequency
      });
      // alert("Medication added successfully!");

      toast.success("Medication added");
      setTabletName('');
      setTimes(['']);
      setStartDate(new Date());
      setFrequency('Daily');
      loadMedications();
    } catch (err) {
      toast.error("Failed to add medication");
    }
  };

  const handleMarkAsTaken = async (tabletId, time) => {
    try {
      await markTabletAsTaken({ tabletId, time });
      toast.success("Marked as taken!");
      loadMedications();
    } catch (err) {
      toast.error("Error marking as taken");
    }
  };


  return (
    <div className="container-lg py-4 px-3 px-sm-4">
      <h2 className="text-center mb-5 display-5 fw-bold text-success">
        <FaPills className="me-2" /> Medication Tracker
      </h2>

      {/* Add Medication Card */}
      <div className="card shadow-lg border-success mb-5">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0 d-flex align-items-center">
            <FaPlus className="me-2" /> Add New Medication
          </h5>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleAddMedication}>
            <div className="row g-3">
              {/* Tablet Name */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Tablet Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={tabletName}
                  onChange={(e) => setTabletName(e.target.value)}
                  placeholder="e.g., Dolo 650"
                  required
                />
              </div>

              {/* Frequency */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Frequency</label>
                <select
                  className="form-select form-select-lg"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              {/* Times */}
              <div className="col-12">
                <label className="form-label fw-semibold">Dosage Times</label>
                {times.map((time, index) => (
                  <div className="input-group mb-2" key={index}>
                    <input
                      type="time"
                      className="form-control form-control-lg"
                      value={time}
                      onChange={(e) => handleTimeChange(e.target.value, index)}
                      required
                    />
                    {times.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleRemoveTime(index)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  className="btn btn-outline-success btn-sm mt-2"
                  onClick={handleAddTime}
                >
                  + Add Another Time
                </button>
              </div>

              {/* Start Date */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="form-control form-control-lg"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-success btn-lg py-3">
                <FaPills className="me-2" /> Add Medication
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Date Filter */}
      <div className="d-flex justify-content-center mb-5">
        <div className="card shadow-sm border-success" style={{ width: 'fit-content' }}>
          <div className="card-body p-2">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="form-control border-0"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
      </div>

      {/* Medications Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {medications.map((med) => (
          <div className="col" key={med._id}>
            <div className="card shadow-sm h-100 border-success">
              <div className="card-header bg-success bg-opacity-10">
                <h5 className="mb-0 d-flex align-items-center text-success">
                  <FaPills className="me-2" /> {med.tabletName}
                </h5>
              </div>
              
              <div className="card-body">
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="badge bg-info w-100">Frequency: {med.frequency}</div>
                  </div>
                  <div className="col-6">
                    <div className="badge bg-secondary w-100">
                      Started: {new Date(med.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="list-group">
                  {med.times.map((time) => {
                    const isTaken = med.takenLog?.some(log => log.date === todayStr && log.time === time);
                    return (
                      <div 
                        key={time} 
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center">
                          <FaClock className="me-2 text-muted" />
                          <span className="fw-bold">{time}</span>
                        </div>

                        {isTaken ? (
                          <span className="text-success d-flex align-items-center">
                            <FaCheckCircle className="me-1" /> Taken
                          </span>
                        ) : (
                          <button
                            className="btn btn-sm btn-success px-3"
                            onClick={() => handleMarkAsTaken(med._id, time)}
                          >
                            Mark
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationPage;