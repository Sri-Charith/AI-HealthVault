import React from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../App.css';
import healthTrackingImg from '../assets/health_tracking.png';

// React Icons
import {
  FaEgg, FaMoon, FaDumbbell, FaPills, FaCalendarAlt, FaHeartbeat,
  FaRobot, FaRunning, FaUserCheck, FaQuoteLeft, FaInstagram, FaTwitter, FaLinkedin
} from 'react-icons/fa';

AOS.init();

const Dashboard = () => {
  const features = [
    { title: 'Diet Tracking', img: 'https://cdn.pixabay.com/photo/2016/11/20/09/06/salad-1844894_960_720.jpg', icon: <FaEgg className="text-success display-5 mb-3" /> },
    { title: 'Sleep Monitoring', img: 'https://cdn.pixabay.com/photo/2016/03/27/20/59/woman-1283009_960_720.jpg', icon: <FaMoon className="text-success display-5 mb-3" /> },
    { title: 'Fitness Goals', img: 'https://cdn.pixabay.com/photo/2016/11/21/15/47/bodybuilder-1846704_960_720.jpg', icon: <FaDumbbell className="text-success display-5 mb-3" /> },
    { title: 'Medication Reminders', img: 'https://cdn.pixabay.com/photo/2020/08/08/06/34/medicine-5474872_960_720.jpg', icon: <FaPills className="text-success display-5 mb-3" /> },
    { title: 'Menstruation Tracker', img: 'https://cdn.pixabay.com/photo/2017/01/31/22/06/calendar-2025845_960_720.png', icon: <FaCalendarAlt className="text-success display-5 mb-3" /> },
    { title: 'Overall Wellness', img: 'https://cdn.pixabay.com/photo/2018/01/09/08/54/wellness-3077028_960_720.jpg', icon: <FaHeartbeat className="text-success display-5 mb-3" /> }
  ];

  const highlights = [
    { icon: <FaRobot className="text-success display-5 mb-2" />, title: 'All in One Platform' },
    { icon: <FaRunning className="text-success display-5 mb-2" />, title: 'Real-time Tracking' },
    { icon: <FaUserCheck className="text-success display-5 mb-2" />, title: 'Fully Personalized' }
  ];

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

  return (
    <>
      <div className="hero-section text-white text-center d-flex align-items-center justify-content-center" style={{ height: '90vh', backgroundImage: `url(${healthTrackingImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="bg-dark bg-opacity-50 p-5 rounded">
          <h1 className="display-4 fw-bold" data-aos="fade-up">HealthVault</h1>
          <p className="lead mt-3" data-aos="fade-up" data-aos-delay="200">Your Personalized Wellness Companion</p>
          <Link to="/dashboard" className="btn btn-success btn-lg mt-4" data-aos="zoom-in" data-aos-delay="400">Start Tracking</Link>
        </div>
      </div>

      <div className="container py-5">
        <h2 className="text-center text-success mb-5" data-aos="fade-right">Features</h2>
        <div className="row g-4">
          {features.map((feature, i) => (
            <div className="col-md-4" key={i} data-aos="zoom-in" data-aos-delay={`${i * 100}`}>
              <div className="card h-100 shadow-sm border-0 text-center p-3">
                {feature.icon}
                {/* <img src={feature.img} alt={feature.title} className="card-img-top rounded" /> */}
                <div className="card-body">
                  <h5 className="card-title text-success">{feature.title}</h5>
                  <p className="card-text">Track your {feature.title.toLowerCase()} with smart analytics and reminders.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-light py-5">
        <div className="container text-center">
          <h2 className="text-success mb-4" data-aos="fade-up">Why Choose HealthVault?</h2>
          <p className="lead mb-4" data-aos="fade-up" data-aos-delay="200">We blend modern tech with holistic health approaches to give you the best wellness tracking experience.</p>
          <div className="row justify-content-center">
            {highlights.map((item, i) => (
              <div className="col-md-3" key={i} data-aos="flip-up" data-aos-delay={`${i * 150}`}>
                <div className="p-3 shadow rounded bg-white mb-3">
                  {item.icon}
                  <h5 className="text-success">{item.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <h2 className="text-center text-success mb-4" data-aos="fade-right">What Our Users Say</h2>
        <div className="row justify-content-center">
          {testimonials.map((user, i) => (
            <div className="col-md-5" key={i} data-aos="fade-up" data-aos-delay={`${i * 200}`}>
              <div className="card mb-4 shadow-sm border-0 p-3">
                <div className="d-flex align-items-center">
                  <img src={user.img} alt={user.name} className="rounded-circle me-3" width="60" />
                  <div>
                    <h6 className="mb-0 text-success">{user.name}</h6>
                    <p className="text-muted mb-1">
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

      <footer className="bg-success text-white py-4">
        <div className="container text-center">
          <p>&copy; 2025 HealthVault. All rights reserved.</p>
          <p>Contact: healthvault@gmail.com | +91 9704600114</p>
          <div>
            <a href="#" className="text-white me-3"><FaInstagram /></a>
            <a href="#" className="text-white me-3"><FaTwitter /></a>
            <a href="#" className="text-white"><FaLinkedin /></a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;
