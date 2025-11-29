// // src/pages/Login.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const handleLogin = async (e) => {
//     e.preventDefault();
  
//     try {
//       const res = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//       });
  
//       const data = await res.json();
  
//       if (!res.ok) {
//         alert(data.message || "Login failed");
//         return;
//       }
  
//       // Save token to localStorage
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
  
//       // Navigate on success
//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Login error:', err);
//       alert("Something went wrong during login.");
//     }
//   };
  

//   return (
//     <div className="container mt-5">
//       <div className="card p-4 shadow">
//         <h2 className="text-center text-success">Login</h2>
//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <label>Email</label>
//             <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
//           </div>
//           <div className="mb-3">
//             <label>Password</label>
//             <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} required />
//           </div>
//           <button className="btn btn-success w-100">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css'; // Normal CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert("Something went wrong during login.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <div className="forgot-link">
          <Link to="/reset-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
