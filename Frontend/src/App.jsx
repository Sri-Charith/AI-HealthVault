import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Diet from './pages/Diet';
import SleepPage from './pages/SleepPage'
import Meditation from './pages/MedicationPage';
import MenstruationPage from './pages/MenstruationPage';
import FitnessTracker from './pages/FitnessTracker';
import ResetPassword from './pages/ResetPassword';
import { Toaster } from 'react-hot-toast'; // Add this import
import TipsPage from './pages/TipsPage';
import ProfilePage from './pages/ProfilePage';
export default function App() {
  return (
    <>
      <Navbar />
      <Toaster // Add this component
        position="top-center"
        gutter={12}
        containerStyle={{ margin: '8px' }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px',
            backgroundColor: '#fff',
            color: '#374151',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/sleep" element={<SleepPage />} />
        <Route path="/medication" element={<Meditation />} />
        <Route path="/menstruation" element={<MenstruationPage />} />
        <Route path="/fitness" element={<FitnessTracker />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
      <Footer />
    </>
  );
}