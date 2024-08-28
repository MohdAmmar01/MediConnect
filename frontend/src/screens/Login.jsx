import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import '../styles/login.css';
import back from '../assets/images/background.jpg';
import loader from "../assets/loader/loader.gif";
import { useDispatch } from 'react-redux';
import { setdata, setisLoggedin } from '../../redux/reducers/userSlice';
import toast from 'react-hot-toast'; // Ensure toast is imported
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please Fill All The Fields", { position: 'top-center' });
    }

    setLoading(true);

    try {
      const response = await axios.post('https://medi-connect-backend.onrender.com/api/users/login', { email, password });
      if (response.data.success) {
        toast.success("Login Successful!", { position: 'top-center' });
        dispatch(setisLoggedin(true));
        dispatch(setdata(response.data.message));
        navigate("/");
      } else {
        toast.error(response.data.message, { position: 'top-center' });
      }
    } catch (error) {
      toast.error('Internal Server Error Occurred!', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login">
        <Navbar />
        <div className="image-container">
          <img src={back} alt="Login Background" />
        </div>
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter Your Email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter Your Password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loading ?
              <img src={loader} style={{ width: "50px", height: "50px" }} alt="loader" />
              :
              <button type="submit">Login</button>
            }
          </form>
          <div className="additional-options">
            <a href="/forgot-password">Forgot Password?</a>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </div>
      </div>
    </>

  );
};

export default LoginPage;
