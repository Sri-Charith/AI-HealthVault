import React, { useEffect, useState } from 'react';
import {
  fetchMedications,
  addMedication,
  markTabletAsTaken,
  updateMedicationStock
} from '../utils/api';
import "../styles/medication.css";
import { FaPills, FaClock, FaCheckCircle, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const MedicationPage = () => {
  const [medications, setMedications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingStock, setEditingStock] = useState(null);
  const [editStockQuantity, setEditStockQuantity] = useState('');
  const [editTabletsPerDose, setEditTabletsPerDose] = useState('');

  // Form States
  const [tabletName, setTabletName] = useState('');
  const [times, setTimes] = useState(['']);
  const [startDate, setStartDate] = useState(new Date());
  const [frequency, setFrequency] = useState('Daily');
  const [stockQuantity, setStockQuantity] = useState('');
  const [tabletsPerDose, setTabletsPerDose] = useState('1');

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
        frequency,
        stockQuantity: stockQuantity ? Number(stockQuantity) : 0,
        tabletsPerDose: tabletsPerDose ? Number(tabletsPerDose) : 1
      });
      // alert("Medication added successfully!");

      toast.success("Medication added");
      setTabletName('');
      setTimes(['']);
      setStartDate(new Date());
      setFrequency('Daily');
      setStockQuantity('');
      setTabletsPerDose('1');
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

  const handleEditStock = (med) => {
    setEditingStock(med._id);
    setEditStockQuantity(med.stockQuantity || '');
    setEditTabletsPerDose(med.tabletsPerDose || 1);
  };

  const handleSaveStock = async (medId) => {
    try {
      await updateMedicationStock(medId, {
        stockQuantity: Number(editStockQuantity),
        tabletsPerDose: Number(editTabletsPerDose)
      });
      toast.success("Stock updated successfully!");
      setEditingStock(null);
      loadMedications();
    } catch (err) {
      toast.error("Error updating stock");
    }
  };

  const handleCancelEdit = () => {
    setEditingStock(null);
    setEditStockQuantity('');
    setEditTabletsPerDose('');
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

              {/* Stock Quantity */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Stock Quantity</label>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="e.g., 100"
                  min="0"
                />
                <small className="text-muted">Current number of tablets in stock</small>
              </div>

              {/* Tablets Per Dose */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Tablets Per Dose</label>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  value={tabletsPerDose}
                  onChange={(e) => setTabletsPerDose(e.target.value)}
                  placeholder="e.g., 1"
                  min="1"
                />
                <small className="text-muted">Number of tablets taken per dose</small>
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

                {/* Stock Information Card */}
                <div className="card border-warning mb-3" style={{ backgroundColor: med.stockQuantity > 0 ? '#fff3cd' : '#f8d7da' }}>
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="card-title text-warning-emphasis mb-0">
                        📦 Stock Information
                      </h6>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditStock(med)}
                        style={{ display: editingStock === med._id ? 'none' : 'block' }}
                      >
                        <FaEdit className="me-1" /> Edit
                      </button>
                    </div>

                    {editingStock === med._id ? (
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label small">Stock Quantity</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={editStockQuantity}
                            onChange={(e) => setEditStockQuantity(e.target.value)}
                            min="0"
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small">Tablets Per Dose</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={editTabletsPerDose}
                            onChange={(e) => setEditTabletsPerDose(e.target.value)}
                            min="1"
                          />
                        </div>
                        <div className="col-12 mt-2">
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleSaveStock(med._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="d-flex flex-column">
                            <small className="text-muted">Current Stock</small>
                            <strong className={`fs-5 ${med.stockQuantity > 0 ? 'text-primary' : 'text-danger'}`}>
                              {med.stockQuantity || 0} tablets
                            </strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex flex-column">
                            <small className="text-muted">Per Dose</small>
                            <strong className="text-secondary">{med.tabletsPerDose || 1} tablet(s)</strong>
                          </div>
                        </div>
                        {med.estimatedRefillDate && med.stockQuantity > 0 && (
                          <div className="col-12 mt-2">
                            <div className={`alert mb-0 py-2 ${new Date(med.estimatedRefillDate) < new Date() ? 'alert-danger' : 'alert-warning'}`}>
                              <small className="d-block text-muted">Estimated Refill Date</small>
                              <strong className="text-dark">
                                {new Date(med.estimatedRefillDate).toLocaleDateString()}
                              </strong>
                              {new Date(med.estimatedRefillDate) < new Date() && (
                                <span className="badge bg-danger ms-2">⚠️ Low Stock</span>
                              )}
                            </div>
                          </div>
                        )}
                        {(!med.stockQuantity || med.stockQuantity === 0) && (
                          <div className="col-12 mt-2">
                            <div className="alert alert-danger mb-0 py-2">
                              <small>⚠️ No stock information available. Add stock to track refill dates.</small>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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