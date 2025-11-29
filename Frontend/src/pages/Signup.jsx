import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css'; // Ensure this file contains your custom CSS

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    goals: [],
    age: '',
    gender: '',
    height: '',
    weight: '',
    focus: '',
    diet: ''
  });

  const navigate = useNavigate();

  // Automatically handle menstruation goal based on gender
  useEffect(() => {
    const updatedGoals = new Set(formData.goals);
    if (formData.gender === 'Female') {
      updatedGoals.add('Menstruation');
    } else {
      updatedGoals.delete('Menstruation');
    }
    setFormData({ ...formData, goals: Array.from(updatedGoals) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.gender]);

  const handleCheckbox = (goal) => {
    let newGoals = [...formData.goals];

    if (goal === 'Overall') {
      if (newGoals.includes('Overall')) {
        // Remove Overall and other specific goals (excluding menstruation)
        newGoals = newGoals.filter(g => !['Overall', 'Diet', 'Sleep', 'Fitness', 'Medication']);
      } else {
        // Add all main goals except menstruation
        newGoals = Array.from(new Set([...newGoals, 'Overall', 'Diet', 'Sleep', 'Fitness', 'Medication']));
      }
    } else {
      if (newGoals.includes(goal)) {
        newGoals = newGoals.filter(g => g !== goal);
      } else {
        newGoals.push(goal);
      }

      // If deselecting one of the others manually, remove Overall
      if (['Diet', 'Sleep', 'Fitness', 'Medication'].includes(goal) && newGoals.includes('Overall')) {
        newGoals = newGoals.filter(g => g !== 'Overall');
      }
    }

    setFormData({ ...formData, goals: newGoals });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => {
    if (step === 1) {
      const { username, email, password, confirmPassword } = formData;
      if (!username || !email || !password || !confirmPassword) {
        return alert("Please fill all fields");
      }
      if (password !== confirmPassword) {
        return alert("Passwords do not match");
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.goals.length === 0) return alert("Select at least one goal");
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // Auto-login after signup
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          localStorage.setItem('token', loginData.token);
          console.log('User data:', loginData.user);
          localStorage.setItem('user', JSON.stringify(loginData.user));
          alert('Signup successful! Redirecting to dashboard...');
          navigate('/dashboard');
        } else {
          alert('Signup succeeded, but auto-login failed.');
        }
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Signup failed due to network/server issue');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="text-center mb-4">Signup</h2>

        {step === 1 && (
          <>
            <input type="text" name="username" placeholder="Username" className="form-input" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="form-input" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="form-input" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" className="form-input" onChange={handleChange} required />
            <button className="form-btn" onClick={handleNext}>Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-center">Select your primary goals (at least one):</p>
            <div className="checkbox-group">
              {['Diet', 'Sleep', 'Fitness', 'Medication', 'Overall'].map(goal => (
                <label key={goal} className="custom-checkbox">
                  <input type="checkbox" checked={formData.goals.includes(goal)} onChange={() => handleCheckbox(goal)} />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
            <button className="form-btn mt-3" onClick={handleNext}>Next</button>
          </>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <input type="number" name="age" placeholder="Age" className="form-input" onChange={handleChange} required />

            <select name="gender" className="form-input" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <div className="form-inline">
              <input type="number" name="height" placeholder="Height (cm)" className="form-input" onChange={handleChange} required />
              <input type="number" name="weight" placeholder="Weight (kg)" className="form-input" onChange={handleChange} required />
            </div>

            <select name="focus" className="form-input" onChange={handleChange} required>
              <option value="">Health Focus</option>
              <option>Weight Loss</option>
              <option>Weight Gain</option>
              <option>Muscle Build</option>
              <option>Stay Healthy</option>
            </select>

            <select name="diet" className="form-input" onChange={handleChange} required>
              <option value="">Food Habit</option>
              <option>Vegan</option>
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
              <option>Pescatarian</option>
              <option>Flexitarian</option>
            </select>

            <button className="form-btn mt-2">Enroll</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;

