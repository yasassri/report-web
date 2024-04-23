import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ReportPage from './components/ReportPage';
import Cookies from 'js-cookie';

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({ username: '' });

  useEffect(() => {
    let isUserInfoSet = false;

    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserDetails(userDetails);
      setLoggedIn(true);
      isUserInfoSet = true;
    }

    if (!isUserInfoSet) {
      const encodedUserInfo = Cookies.get('userinfo');
      if (encodedUserInfo) {
        const userInfo = JSON.parse(atob(encodedUserInfo));
        setUserDetails(userInfo);
        setLoggedIn(true);
        localStorage.setItem('userDetails', JSON.stringify(userInfo));
      }
    }

    setLoading(false);
  }, []);


  const handleLogout = () => {
    // Clear any stored user information
    setUserDetails({});
    setLoggedIn(false);
    localStorage.removeItem('userDetails');

    // Redirect to Choreo logout with session_hint
    const sessionHint = Cookies.get('session_hint');
    window.location.href = `/auth/logout?session_hint=${sessionHint}`;

    Cookies.remove('userinfo', { path: '/' });
  };

  return (
    <Router>
        {loggedIn && (
          <div className="toolbar">
            <div>Hello, {userDetails.username}</div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}   
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={loggedIn ? <ReportPage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    </Router>
  );
}

export default App;
