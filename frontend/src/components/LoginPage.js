import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulated authentication logic (replace with actual authentication)
    if (username === 'admin' && password === 'password') {
      onLogin();
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className='container'>
      <div className='login-container'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" onClick={() => window.location.href = "/auth/login"}>Login</button>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;