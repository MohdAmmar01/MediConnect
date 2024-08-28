import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/resetpassword.css';
import back from '../assets/images/background.jpg';
import Navbar from '../components/Navbar';

const ResetPasswordPage = () => {
  const { emailParam, codeParam } = useParams();
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState(codeParam);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
    if (codeParam) setCode(codeParam);
  }, [emailParam, codeParam]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://medi-connect-backend-beno.onrender.com/api/users/resetpassword', { email, code, newPassword });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="reset">
      <Navbar />
      <div className="image-container">
        <img src={back} alt="Reset Password Background" />
      </div>
      <div className="reset-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Enter Your Email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Your Verification Code here"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Your New Password here"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
