import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RolePicker from './components/onboarding/RolePicker';
import Dashboard from './pages/Dashboard';
import JodiMatcher from './pages/JodiMatcher';
import PulseLedger from './pages/PulseLedger';
import SyndicateHub from './pages/SyndicateHub';
import ExpertMarketplace from './pages/ExpertMarketplace';
import VisionPage from './pages/VisionPage';
import Navbar from './components/layout/Navbar';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Hide navbar on onboarding/role picker page
  const showNavbar = isAuthenticated && location.pathname !== '/onboarding';

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "pt-24" : ""}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={isAuthenticated ? <RolePicker onComplete={() => window.location.href = '/dashboard'} /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/matcher" element={isAuthenticated ? <JodiMatcher /> : <Navigate to="/login" />} />
          <Route path="/pulse" element={isAuthenticated ? <PulseLedger /> : <Navigate to="/login" />} />
          <Route path="/syndicate" element={isAuthenticated ? <SyndicateHub /> : <Navigate to="/login" />} />
          <Route path="/marketplace" element={isAuthenticated ? <ExpertMarketplace /> : <Navigate to="/login" />} />
          <Route path="/vision" element={<VisionPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
