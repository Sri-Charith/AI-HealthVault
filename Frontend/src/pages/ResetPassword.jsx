// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import '../styles/resetpassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to reset password');
        return;
      }

      alert('Password updated successfully!');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Reset error:', error);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-card" onSubmit={handleReset}>
        <h3>Reset Password</h3>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
