import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      onLogin();
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className='container'>
      <div className='login-container'>
      <h1>Welcome to partner report generation portal.</h1>
      <br/>
      <p> Please login to continue if you have a registered account if not contact the Administrator.</p>
      <button type="submit" onClick={() => window.location.href = "/auth/login"}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;