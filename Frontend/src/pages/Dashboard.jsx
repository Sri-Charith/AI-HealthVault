// import React from 'react';
// import { Link } from 'react-router-dom';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import '../App.css';
// import healthTrackingImg from '../assets/health_tracking.png';

// import {
//   FaEgg, FaMoon, FaDumbbell, FaPills, FaCalendarAlt, FaHeartbeat,
//   FaRobot, FaRunning, FaUserCheck, FaQuoteLeft, FaInstagram, FaTwitter, FaLinkedin
// } from 'react-icons/fa';

// AOS.init();

// const Dashboard = () => {
//   const features = [
//     { title: 'Diet Tracking', icon: <FaEgg className="text-success fs-1 mb-3" /> },
//     { title: 'Sleep Monitoring', icon: <FaMoon className="text-success fs-1 mb-3" /> },
//     { title: 'Fitness Goals', icon: <FaDumbbell className="text-success fs-1 mb-3" /> },
//     { title: 'Medication Reminders', icon: <FaPills className="text-success fs-1 mb-3" /> },
//     { title: 'Menstruation Tracker', icon: <FaCalendarAlt className="text-success fs-1 mb-3" /> },
//     { title: 'Overall Wellness', icon: <FaHeartbeat className="text-success fs-1 mb-3" /> }
//   ];

//   const highlights = [
//     { icon: <FaRobot className="text-success fs-1 mb-2" />, title: 'All in One Platform' },
//     { icon: <FaRunning className="text-success fs-1 mb-2" />, title: 'Real-time Tracking' },
//     { icon: <FaUserCheck className="text-success fs-1 mb-2" />, title: 'Fully Personalized' }
//   ];

//   const testimonials = [
//     {
//       name: 'Aarav K.',
//       msg: 'HealthVault helped me lose 10kgs and stay fit with regular insights.',
//       img: 'https://randomuser.me/api/portraits/men/45.jpg'
//     },
//     {
//       name: 'Sneha R.',
//       msg: 'The menstrual tracker is spot on and very intuitive!',
//       img: 'https://randomuser.me/api/portraits/women/65.jpg'
//     }
//   ];

//   return (
//     <>
//       <div className="hero-section text-white text-center d-flex align-items-center justify-content-center"
//         style={{
//           height: '90vh',
//           backgroundImage: `url(${healthTrackingImg})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           overflow: 'hidden'
//         }}>
//         <div className="bg-dark bg-opacity-50 p-4 rounded w-75">
//           <h1 className="display-4 fw-bold" data-aos="fade-up">HealthVault</h1>
//           <p className="lead mt-2" data-aos="fade-up" data-aos-delay="200">Your Personalized Wellness Companion</p>
//           <Link to="/dashboard" className="btn btn-success btn-lg mt-4" data-aos="zoom-in" data-aos-delay="400">Start Tracking</Link>
//         </div>
//       </div>

//       <div className="container py-5">
//         <h2 className="text-center text-success mb-5" data-aos="fade-right">Features</h2>
//         <div className="row g-4">
//           {features.map((feature, i) => (
//             <div className="col-12 col-sm-6 col-lg-4" key={i} data-aos="zoom-in" data-aos-delay={`${i * 100}`}>
//               <div className="card h-100 shadow-sm border-0 text-center p-4">
//                 {feature.icon}
//                 <div className="card-body">
//                   <h5 className="card-title text-success">{feature.title}</h5>
//                   <p className="card-text">Track your {feature.title.toLowerCase()} with smart analytics and reminders.</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="bg-light py-5">
//         <div className="container text-center">
//           <h2 className="text-success mb-4" data-aos="fade-up">Why Choose HealthVault?</h2>
//           <p className="lead mb-4" data-aos="fade-up" data-aos-delay="200">
//             We blend modern tech with holistic health approaches to give you the best wellness tracking experience.
//           </p>
//           <div className="row justify-content-center">
//             {highlights.map((item, i) => (
//               <div className="col-12 col-sm-6 col-md-4 mb-3" key={i} data-aos="flip-up" data-aos-delay={`${i * 150}`}>
//                 <div className="p-4 shadow rounded bg-white h-100">
//                   {item.icon}
//                   <h5 className="text-success mt-2">{item.title}</h5>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="container py-5">
//         <h2 className="text-center text-success mb-4" data-aos="fade-right">What Our Users Say</h2>
//         <div className="row justify-content-center">
//           {testimonials.map((user, i) => (
//             <div className="col-12 col-md-6 mb-3" key={i} data-aos="fade-up" data-aos-delay={`${i * 200}`}>
//               <div className="card shadow-sm border-0 p-4 h-100">
//                 <div className="d-flex align-items-start">
//                   <img src={user.img} alt={user.name} className="rounded-circle me-3" width="60" height="60" />
//                   <div>
//                     <h6 className="mb-1 text-success">{user.name}</h6>
//                     <p className="text-muted mb-0"><FaQuoteLeft className="text-success me-2" />{user.msg}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <footer className="bg-success text-white py-4 mt-3">
//         <div className="container text-center">
//           <p className="mb-1">&copy; 2025 HealthVault. All rights reserved.</p>
//           <p className="mb-2">Contact: healthvault@gmail.com | +91 9704600114</p>
//           <div>
//             <a href="#" className="text-white me-3"><FaInstagram /></a>
//             <a href="#" className="text-white me-3"><FaTwitter /></a>
//             <a href="#" className="text-white"><FaLinkedin /></a>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import healthTrackingImg from '../assets/health_tracking.png';
import {
  FaEgg, FaMoon, FaDumbbell, FaPills, FaCalendarAlt, FaHeartbeat,
  FaRobot, FaRunning, FaUserCheck, FaQuoteLeft, FaInstagram, 
  FaTwitter, FaLinkedin, FaCheckCircle, FaEdit
} from 'react-icons/fa';

AOS.init({ duration: 1000 });

const featureIcons = {
  Diet: <FaEgg className="text-success fs-1 mb-3" />,
  Sleep: <FaMoon className="text-success fs-1 mb-3" />,
  Fitness: <FaDumbbell className="text-success fs-1 mb-3" />,
  Medication: <FaPills className="text-success fs-1 mb-3" />,
  Menstruation: <FaCalendarAlt className="text-success fs-1 mb-3" />,
  Overall: <FaHeartbeat className="text-success fs-1 mb-3" />
};

const Dashboard = () => {
  const [userGoals, setUserGoals] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [tempGoals, setTempGoals] = useState([]);
  const [allFeatures] = useState(['Diet', 'Sleep', 'Fitness', 'Medication', 'Menstruation', 'Overall']);

  const testimonials = [
    {
      name: 'Aarav K.',
      msg: 'HealthVault helped me lose 10kgs and stay fit with regular insights.',
      img: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      name: 'Sneha R.',
      msg: 'The menstrual tracker is spot on and very intuitive!',
      img: 'https://randomuser.me/api/portraits/women/65.jpg'
    }
  ];

  useEffect(() => {
    const fetchUserGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("user goals",response.data);
        setUserGoals(response.data.goals);
      } catch (error) {
        toast.error('Failed to load user preferences');
      }
    };
    fetchUserGoals();
  }, []);

  const handlePreferencesToggle = () => {
    setShowPreferences(!showPreferences);
    setTempGoals([...userGoals]);
  };

  const handleGoalChange = (goal) => {
    let updatedGoals = [...tempGoals];
    if (goal === 'Overall') {
      updatedGoals = updatedGoals.includes('Overall') ? [] : allFeatures;
    } else {
      if (updatedGoals.includes(goal)) {
        updatedGoals = updatedGoals.filter(g => g !== goal && g !== 'Overall');
      } else {
        updatedGoals.push(goal);
        if (updatedGoals.length === allFeatures.length - 1) {
          updatedGoals.push('Overall');
        }
      }
    }
    setTempGoals(updatedGoals);
  };
  const savePreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put('http://localhost:5000/api/auth/update-goals', 
        { goals: tempGoals },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Fetch updated user data
      const updatedUser = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser.data));
      
      // Trigger storage event for navbar refresh
      window.dispatchEvent(new Event('storage'));
  
      setUserGoals(tempGoals);
      setShowPreferences(false);
      toast.success('Preferences updated!');
  
    } catch (error) {
      toast.error('Update failed');
    }
  };
  // const savePreferences = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
      // await axios.put('http://localhost:5000/api/auth/update-goals', 
      //   { goals: tempGoals },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
  //     setUserGoals(tempGoals);
  //     setShowPreferences(false);
  //     toast.success('Preferences updated successfully!');
  //   } catch (error) {
  //     toast.error('Failed to update preferences');
  //   }
  // };

  const getActiveFeatures = () => {
    if (userGoals.includes('Overall')) return allFeatures;
    return userGoals;
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section  text-center d-flex align-items-center justify-content-center"
        style={{
          minHeight: '70vh',
          background: `linear-gradient(rgba(0,0,0,0.6), url(${healthTrackingImg}))`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-3 text-black" data-aos="fade-up">
            Health<span className="text-black">Vault</span>
          </h1>
          <p className="lead mb-4" data-aos="fade-up" data-aos-delay="200">
            Your Personalized Wellness Companion
          </p>
          <Link 
            to="/dashboard" 
            className="btn btn-success btn-lg px-5 py-3"
            data-aos="zoom-in" 
            data-aos-delay="400"
          >
            Start Tracking
          </Link>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="container py-5">
        <div className="card shadow-lg border-success">
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Your Health Preferences</h5>
            <button 
              className="btn btn-light btn-sm"
              onClick={handlePreferencesToggle}
            >
              <FaEdit className="me-1" /> {showPreferences ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {showPreferences ? (
            <div className="card-body">
              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
                {allFeatures.map((feature) => (
                  <div className="col" key={feature}>
                    <div 
                      className={`card h-100 cursor-pointer ${tempGoals.includes(feature) ? 'border-success bg-light' : ''}`}
                      onClick={() => handleGoalChange(feature)}
                      style={{ transition: 'all 0.2s' }}
                    >
                      <div className="card-body text-center">
                        {featureIcons[feature]}
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={tempGoals.includes(feature)}
                            readOnly
                          />
                          <label className="form-check-label fw-medium">{feature}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="btn btn-success mt-4 w-100 py-2"
                onClick={savePreferences}
              >
                <FaCheckCircle className="me-2" /> Save Preferences
              </button>
            </div>
          ) : (
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {getActiveFeatures().map((goal) => (
                  <span 
                    key={goal} 
                    className="badge bg-success d-flex align-items-center py-2"
                  >
                    <FaCheckCircle className="me-2" /> {goal}
                  </span>
                ))}
              </div>
              {userGoals.length === 0 && (
                <p className="text-muted mt-3 mb-0">No health preferences selected yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="container py-5">
        <h2 className="text-center text-success mb-5" data-aos="fade-right">Your Health Features</h2>
        <div className="row g-4">
          {getActiveFeatures().map((feature, i) => (
            <div 
              className="col-12 col-sm-6 col-lg-4" 
              key={i} 
              data-aos="zoom-in" 
              data-aos-delay={`${i * 100}`}
            >
              <div className="card h-100 shadow-sm border-0 text-center p-4 hover-effect">
                {featureIcons[feature]}
                <div className="card-body">
                  <h5 className="card-title text-success mb-3">{feature}</h5>
                  <p className="card-text text-muted mb-4">
                    Track your {feature.toLowerCase()} with smart analytics and reminders.
                  </p>
                  {feature !== 'Overall' && (
                    <Link 
                      to={`/${feature.toLowerCase()}`} 
                      className="btn btn-outline-success px-4"
                    >
                      Open Tracker
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights Section */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h2 className="text-success mb-4" data-aos="fade-up">Why Choose Us?</h2>
          <div className="row justify-content-center g-4">
            <div className="col-12 col-md-4" data-aos="fade-up">
              <div className="p-4 bg-white rounded shadow">
                <FaRobot className="text-success fs-1 mb-3" />
                <h5 className="text-success">All-in-One Platform</h5>
                <p className="text-muted">Comprehensive health tracking in single dashboard</p>
              </div>
            </div>
            <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="p-4 bg-white rounded shadow">
                <FaRunning className="text-success fs-1 mb-3" />
                <h5 className="text-success">Real-time Tracking</h5>
                <p className="text-muted">Instant insights and progress updates</p>
              </div>
            </div>
            <div className="col-12 col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="p-4 bg-white rounded shadow">
                <FaUserCheck className="text-success fs-1 mb-3" />
                <h5 className="text-success">Personalized Experience</h5>
                <p className="text-muted">Customized to your unique health needs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container py-5">
        <h2 className="text-center text-success mb-5" data-aos="fade-right">User Stories</h2>
        <div className="row g-4">
          {testimonials.map((user, i) => (
            <div 
              className="col-12 col-md-6" 
              key={i} 
              data-aos="fade-up" 
              data-aos-delay={`${i * 150}`}
            >
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex align-items-start">
                  <img 
                    src={user.img} 
                    alt={user.name} 
                    className="rounded-circle me-4" 
                    width="80" 
                    height="80" 
                  />
                  <div>
                    <h6 className="text-success mb-2">{user.name}</h6>
                    <p className="text-muted mb-0">
                      <FaQuoteLeft className="text-success me-2" />
                      {user.msg}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-success text-white py-5 mt-4">
        <div className="container text-center">
          <div className="d-flex justify-content-center gap-4 mb-3">
            <a href="#" className="text-white"><FaInstagram size={24} /></a>
            <a href="#" className="text-white"><FaTwitter size={24} /></a>
            <a href="#" className="text-white"><FaLinkedin size={24} /></a>
          </div>
          <p className="mb-1">&copy; 2025 HealthVault. All rights reserved</p>
          <p className="mb-0">Contact: healthvault@gmail.com | +91 9704600114</p>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;