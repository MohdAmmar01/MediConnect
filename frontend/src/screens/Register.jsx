import React, { useState } from 'react';
import axios from 'axios';
import '../styles/register.css';
import back from '../assets/images/background.jpg';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import toast from 'react-hot-toast';

import loader from "../assets/loader/loader.gif"
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const [appointmentFee, setAppointmentFee] = useState('');
  const [specialisation, setSpecialisation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !password) {
        return toast.error("Please Fill All The Fields", { position: 'top-center' })
      }
      setLoading(true)

      const response = await axios.post('https://medi-connect-backend.onrender.com/api/users/register', { name, email, password, isDoctor, appointmentFee, specialisation });
      if (response.data.success == true) {
        toast.success("Congratulations! 🎉 Your Registration is Complete. Verify Your Email to Unlock Your MediConnect Account 📬", { position: 'top-center' })
        setLoading(false)
      } else {
        toast.error(response.data.message, { position: 'top-center' })
        setLoading(false)

      }
    } catch (error) {
      toast.error('Internel Server Error Occured !', { position: 'top-center' })
      setLoading(false)
    }
  };

  return (
    <div className="register">
      <Navbar />
      <div className="image-container">
        <img src={back} alt="Doctor" />
      </div>
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter Your Name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          {isDoctor && (
            <>
              <input
                type="text"
                placeholder="Enter Your Appointment Fees here"
                value={appointmentFee}
                onChange={(e) => setAppointmentFee(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Your Specialisation here "
                value={specialisation}
                onChange={(e) => setSpecialisation(e.target.value)}
              />
            </>

          )}
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="doctorCheck"
              checked={isDoctor}
              onChange={(e) => setIsDoctor(e.target.checked)}
            />
            <label htmlFor="doctorCheck">Register as Doctor</label>
          </div>

          {loading ?
            <img src={loader} style={{ width: "50px", height: "50px" }} alt="loader" />
            :
            <button type="submit">Register</button>
          }
          <p>Already  have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
