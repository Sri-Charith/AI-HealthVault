// // src/components/Navbar.jsx
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [goals, setGoals] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user'));

//     if (token && user) {
//       setIsLoggedIn(true);
//       setGoals(user.goals || []);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     navigate('/login');
//   };

//   const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top" style={{ backgroundColor: '#e6fff2' }}>
//       <div className="container">
//         <Link className="navbar-brand fw-bold text-success" to="/" style={{ fontSize: '24px', transition: '0.3s' }}>
//           <span className="animated-brand">Health<span className="text-dark">Vault</span></span>
//         </Link>

//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarMenu">
//           <ul className="navbar-nav ms-auto">
//             {isLoggedIn ? (
//               <>
//                 {goals.map((goal, index) => (
//                   <li className="nav-item" key={index}>
//                     <Link className="nav-link text-success" to={`/${goal.toLowerCase()}`}>
//                       {capitalize(goal)}
//                     </Link>
//                   </li>
//                 ))}
//                 <li className="nav-item">
//                   <button className="btn btn-outline-success ms-2" onClick={handleLogout}>Logout</button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item"><Link className="nav-link text-success" to="/signup">Signup</Link></li>
//                 <li className="nav-item"><Link className="nav-link text-success" to="/login">Login</Link></li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// src/components/Navbar.jsx


// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { FaBell, FaBars, FaTimes } from 'react-icons/fa';
// import NotificationModal from './NotificationModal';
// import { fetchNotifications, markAllAsRead } from '../utils/api';
// import toast from 'react-hot-toast';
// import "../styles/navbar.css"; // Custom CSS for styling
// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [goals, setGoals] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(true);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Update navbar on login/logout
//   const checkAuth = () => {
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user'));
//     setIsLoggedIn(!!token);
//     setGoals(user?.goals || []);
//   };

//   useEffect(() => {
//     checkAuth();
//     if (isLoggedIn) {
//       loadNotifications();
//     }
//   }, [isLoggedIn, location.pathname]);

//   // Listen to localStorage changes (e.g., from other tabs or same tab login)
//   useEffect(() => {
//     const syncAuth = () => checkAuth();
//     window.addEventListener('storage', syncAuth);
//     return () => window.removeEventListener('storage', syncAuth);
//   }, []);

//   const loadNotifications = async () => {
//     try {
//       const response = await fetchNotifications();
//       setNotifications(response.data);
//       setUnreadCount(response.data.filter(n => !n.read).length);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     navigate('/login');
//   };

//   const toggleNavbar = () => setIsCollapsed(!isCollapsed);

//   const handleOpenModal = () => setModalOpen(true);

//   const handleMarkAllAsRead = async () => {
//     try {
//       await markAllAsRead();
//       toast.success("All notifications marked as read");
//       await loadNotifications();
//       setUnreadCount(0);
//     } catch (err) {
//       toast.error("Failed to mark notifications");
//     }
//   };

//   const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();


//   return (
//     <>
//       <nav className="navbar navbar-expand-md bg-white sticky-top shadow-sm py-2">
//         <div className="container"> {/* Changed from container-fluid to container */}
//           <Link className="navbar-brand fw-bold text-success" to="/" style={{
//             fontSize: '1.5rem',
//             letterSpacing: '-0.5px'
//           }}>
//             Health<span className="text-dark">Vault</span>
//           </Link>

//           <button
//             className="navbar-toggler border-0 p-1" // Added fixed padding
//             type="button"
//             onClick={toggleNavbar}
//             aria-controls="navbarNav"
//             aria-expanded={!isCollapsed}
//             aria-label="Toggle navigation"
//           >
//             {isCollapsed ? (
//               <FaBars className="fs-4" /> // Fixed icon size
//             ) : (
//               <FaTimes className="fs-4" /> // Fixed icon size
//             )}
//           </button>

//           <div
//             className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`}
//             id="navbarNav"
//             style={{ maxWidth: '992px' }} // Added max-width constraint
//           >
//             <ul className="navbar-nav ms-auto align-items-center gap-2 gap-md-3"> {/* Removed mb classes */}
//               {isLoggedIn ? (
//                 <>
//                   {goals.map((goal, index) => (
//                     <li className="nav-item" key={index}>
//                       <Link
//                         className="nav-link text-success px-2 text-nowrap" // Added text-nowrap
//                         to={`/${goal.toLowerCase()}`}
//                         onClick={toggleNavbar}
//                         style={{ fontSize: '0.95rem' }}
//                       >
//                         {capitalize(goal)}
//                       </Link>
//                     </li>
                    
//                   ))}
//                    <li className="nav-item">
//       <Link className="nav-link text-success" to="/tips" onClick={toggleNavbar}>
//         Tips
//       </Link>
//                   </li>
//                   <li className="nav-item">
//       <Link className="nav-link text-success" to="/profile" onClick={toggleNavbar}>
//         Profile
//       </Link>
//     </li>

//                   <li
//                     className="nav-item position-relative mx-2" // Added fixed margin
//                     onClick={() => { handleOpenModal(); toggleNavbar(); }}
//                     style={{ cursor: 'pointer', width: '34px' }} // Fixed width
//                   >
//                     <FaBell className="text-success fs-5" />
//                     {unreadCount > 0 && (
//                       <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
//                         style={{ fontSize: '0.6rem', padding: '4px 6px' }}>
//                         {unreadCount > 5 ? '5+' : unreadCount}
//                       </span>
//                     )}
//                   </li>

//                   <li className="nav-item">
//                     <button
//                       className="btn btn-outline-success px-3 py-1" // Fixed padding
//                       onClick={() => { handleLogout(); toggleNavbar(); }}
//                       style={{ fontSize: '0.95rem' }}
//                     >
//                       Logout
//                     </button>
//                   </li>
//                 </>
//               ) : (
//                 <>
//                   <li className="nav-item">
//                     <Link
//                       className="nav-link text-success px-2" // Added padding
//                       to="/signup"
//                       onClick={toggleNavbar}
//                       style={{ fontSize: '0.95rem' }}
//                     >
//                       Signup
//                     </Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link
//                       className="nav-link text-success px-2" // Added padding
//                       to="/login"
//                       onClick={toggleNavbar}
//                       style={{ fontSize: '0.95rem' }}
//                     >
//                       Login
//                     </Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {modalOpen && (
//         <NotificationModal
//           notifications={notifications}
//           onClose={() => setModalOpen(false)}
//           onMarkAllRead={handleMarkAllAsRead}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;



import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaBars, FaTimes } from 'react-icons/fa';
import NotificationModal from './NotificationModal';
import { fetchNotifications, markAllAsRead } from '../utils/api';
import toast from 'react-hot-toast';
import "../styles/navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [goals, setGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // const checkAuth = async () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     setIsLoggedIn(false);
  //     setGoals([]);
  //     return;
  //   }

  //   try {
  //     const response = await axios.get('http://localhost:5000/api/auth/me', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     const user = response.data;
  //     localStorage.setItem('user', JSON.stringify(user));
  //     setIsLoggedIn(true);
  //     setGoals(user.goals || []);
  //   } catch (error) {
  //     setIsLoggedIn(false);
  //     setGoals([]);
  //   }
  // };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setGoals([]);
      return;
    }
  
    try {
      // Always fetch fresh data from API
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true);
      setGoals(user.goals.filter(g => g !== 'Overall')); // Exclude Overall
  
    } catch (error) {
      handleLogout();
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      await checkAuth();
      if (isLoggedIn) {
        loadNotifications();
      }
    };
    fetchData();
  }, [location.pathname]);

  useEffect(() => {
    const syncAuth = () => checkAuth();
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await fetchNotifications();
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const toggleNavbar = () => setIsCollapsed(!isCollapsed);

  const handleOpenModal = () => setModalOpen(true);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
      await loadNotifications();
      setUnreadCount(0);
    } catch (err) {
      toast.error("Failed to mark notifications");
    }
  };

  const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  return (
    <>
      <nav className="navbar navbar-expand-md bg-white sticky-top shadow-sm py-2">
        <div className="container">
          <Link className="navbar-brand fw-bold text-success" to="/dashboard" style={{ 
            fontSize: '1.5rem',
            letterSpacing: '-0.5px'
          }}>
            Health<span className="text-dark">Vault</span>
          </Link>

          <button
            className="navbar-toggler border-0 p-1"
            type="button"
            onClick={toggleNavbar}
            aria-controls="navbarNav"
            aria-expanded={!isCollapsed}
            aria-label="Toggle navigation"
          >
            {isCollapsed ? <FaBars className="fs-4" /> : <FaTimes className="fs-4" />}
          </button>

          <div 
            className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} 
            id="navbarNav"
            style={{ maxWidth: '992px' }}
          >
            <ul className="navbar-nav ms-auto align-items-center gap-2 gap-md-3">
              {isLoggedIn ? (
                <>
                  {goals
                    .filter(goal => goal !== 'Overall')
                    .map((goal, index) => (
                      <li className="nav-item" key={index}>
                        <Link 
                          className="nav-link text-success px-2 text-nowrap"
                          to={`/${goal.toLowerCase()}`} 
                          onClick={toggleNavbar}
                          style={{ fontSize: '0.95rem' }}
                        >
                          {capitalize(goal)}
                        </Link>
                      </li>
                    ))}
                  
                  <li className="nav-item">
                    <Link className="nav-link text-success" to="/tips" onClick={toggleNavbar}>
                      Tips
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-success" to="/profile" onClick={toggleNavbar}>
                      Profile
                    </Link>
                  </li>

                  <li 
                    className="nav-item position-relative mx-2" 
                    onClick={() => { handleOpenModal(); toggleNavbar(); }} 
                    style={{ cursor: 'pointer', width: '34px' }}
                  >
                    <FaBell className="text-success fs-5" />
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                        style={{ fontSize: '0.6rem', padding: '4px 6px' }}>
                        {unreadCount > 5 ? '5+' : unreadCount}
                      </span>
                    )}
                  </li>

                  <li className="nav-item">
                    <button 
                      className="btn btn-outline-success px-3 py-1"
                      onClick={() => { handleLogout(); toggleNavbar(); }}
                      style={{ fontSize: '0.95rem' }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link 
                      className="nav-link text-success px-2"
                      to="/signup" 
                      onClick={toggleNavbar}
                      style={{ fontSize: '0.95rem' }}
                    >
                      Signup
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className="nav-link text-success px-2"
                      to="/login" 
                      onClick={toggleNavbar}
                      style={{ fontSize: '0.95rem' }}
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {modalOpen && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setModalOpen(false)}
          onMarkAllRead={handleMarkAllAsRead}
        />
      )}
    </>
  );
};

export default Navbar;