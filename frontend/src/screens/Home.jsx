import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Navbar from '../components/Navbar';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/PrivatePage';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { slots } from '../utils/data';


function Home() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const users = useSelector(state => state.users);
  const navigate = useNavigate();

  const handleChange = (selectedOption) => {
    setSelectedSlot(selectedOption);
  };

  const createAppointmentHandler = async (elem) => {
    if (!selectedSlot || !elem) {
      toast.error("Please Select Slot", { position: 'top-center' });
      return
    } else {
      try {
        setLoading(true);

        const res = await axios.post('http://localhost:8000/api/appointments/create-appointment', {
          doctorId: elem._id,
          slot: selectedSlot.value,
          patientId: users?.userdata?._id,
          date: new Date().toLocaleDateString()
        });
        if (res.data.success) {
          toast.success("Appointment Booked Successfully", { position: 'top-center' });
        } else {
          toast.error(res.data.message, { position: 'top-center' });
        }
      } catch (e) {
        toast.error("Something went wrong!", { position: 'top-center' });
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchData = async () => {
    try {
      let url;
      if (users?.userdata?.role === "doctor") {
        url = 'http://localhost:8000/api/users/getAllPatients';
      } else {
        url = 'http://localhost:8000/api/users/getAllDoctors';
      }
      const res = await axios.get(url);
      setData(res.data.message);
    } catch (e) {
      toast.error("Something went wrong!", { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="home-container">
        <Navbar currentPage="home" />
        <div className='home-container-body'>
          <div className='home-container-heading'>
            <h2>Book Your Appointment Today</h2>
            <h3>(Connect with our specialized doctors across various fields)</h3>
          </div>
          <div className='home-container-body-doctors'>
            {loading ? (
              <h1>Loading...</h1>
            ) : data.length === 0 ? (
              <h3>{`No ${users?.userdata?.role == 'doctor' ? 'Patients' : 'Doctors'} Available`}</h3>
            ) : (
              data.map((elem, ind) => (
                <div key={ind} className='home-container-body-doctors-item'>
                  <div className='home-container-body-doctors-part-1'>
                    <h3>{elem.name}</h3>
                    {elem.role === "doctor" && <h3>{`Specialized in: ${elem.specialisation}`}</h3>}
                    {elem.role === "doctor" && <h3>{`Appointment Fees: ₹${elem.appointmentCharge}`}</h3>}
                    {elem.role === "doctor" && (
                      <Select
                        className='react-select'
                        value={selectedSlot}
                        onChange={handleChange}
                        options={slots}
                        placeholder="Select Appointment Slot"
                      />
                    )}
                  </div>
                  <div className='home-container-body-doctors-part-2'>
                    {elem.role === "doctor" ? (
                      <button onClick={() => createAppointmentHandler(elem)}>Book Appointment</button>
                    ) : (
                      <button onClick={() => navigate('chats')}>Chat</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default Home;
