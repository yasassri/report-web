import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Redirect } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ReportPage from './components/ReportPage';
import Cookies from 'js-cookie';


const FakeLoginPage = () => {
  return (
    <div>
      <button
        onClick={() => {
          const value = process.env.REACT_APP_USER_INFO_COOKIE || "";
          Cookies.set("userinfo", value);
          window.location.pathname = "/report";
        }}
      >
        login-quickly
      </button>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({ username: '' });

  useEffect(() => {
    let isUserInfoSet = false;
    if (process.env.NODE_ENV === 'development') {
      // Mock the authentication flow
      const mockUserInfo = { username: 'testuser', name: 'Test User' };
      localStorage.setItem('userDetails', JSON.stringify(mockUserInfo));
      isUserInfoSet = true;
    } else {
      // Mock the authentication flow
      const mockUserInfo = { username: 'testuser', name: 'Test User' };
      localStorage.setItem('userDetails', JSON.stringify(mockUserInfo));
      isUserInfoSet = true;
    }

    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserDetails(userDetails);
      setLoggedIn(true);
      isUserInfoSet = true;
    }

    if (!isUserInfoSet) {
      const encodedUserInfo = Cookies.get('userinfo');
      console.log("XXXXXXXXXXXXXXXXXXXXXXX")
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


  const handleLogin = () => {
    // Simulated authentication logic (replace with actual authentication)
    setLoggedIn(true);
  };
  return (
    <Router>
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/report" element={setLoggedIn ? <ReportPage /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
  );
}

export default App;
