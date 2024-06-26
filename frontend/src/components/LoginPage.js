import React from 'react';

const LoginPage = ({ onLogin }) => {

  return (
    <div className='container'>
      <div className='login-container'>
      <h1>Welcome to the Partner Report Portal</h1>
      <br/>
      <p>Please login to continue; if you do not have a registered account please contact the Administrator.</p>
      <button type="submit" onClick={() => window.location.href = "/auth/login"}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;