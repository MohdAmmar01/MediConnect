import React, { useState } from 'react';
import "../styles/navbar.css";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiMenu } from "react-icons/fi"; // Hamburger icon
import { AiOutlineClose } from "react-icons/ai"; // Close icon

import logo from '../assets/icons/logo.png';

import { CiMedicalCase, CiUser, CiLogout } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { BsChatLeftDots } from "react-icons/bs";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setdata, setisLoggedin } from '../../redux/reducers/userSlice';

function Navbar({ currentPage }) {
  const [showList, setShowList] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
const users=useSelector((state)=>state.users);
  const logouthandler = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/users/logout');
      if (res.data.success) {
        toast.success("Logout Successfully");
        dispatch(setisLoggedin(false));
        dispatch(setdata(null));
        navigate("/login");
      } else {
        toast.error('Something went wrong!');
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const hamburgerHandler = () => {
    setShowList(!showList);
  };

  return (
    <div className={`containerNavbar ${showList ? "open" : ""}`}>
      <div className="heading">
        <div className="hamburger" onClick={hamburgerHandler}>
          {showList ? <AiOutlineClose size={30} /> : <FiMenu size={30} />}
        </div>
      </div>
      <div className={`Side_bar_items ${showList ? "show" : ""}`}>
        <h1 onClick={() => navigate("/")} className="name">MediConnect</h1>
        <img
          onClick={() => navigate("/")}
          src={logo}
          className="logo"
          alt="logo"
        />
        <p className="menu">Main Menu</p>

        <div className="item">
          <CiMedicalCase className="logo_item" />
          <a
            href="/"
            style={currentPage === "home" ? { color: "#240f6a" } : { color: "#8c6df7" }}
            className="item_name"
          >
            Home
          </a>
        </div>
        {
          users?.isloggedin &&
        <div className="item">
          <SlCalender className="logo_item" />
          <a
            href="/my-appointments"
            style={currentPage === "my-appointments" ? { color: "#240f6a" } : { color: "#8c6df7" }}
            className="item_name"
          >
            My Appointments
          </a>
        </div>
}
        {
          users?.isloggedin &&
        <div className="item">
          <BsChatLeftDots className="logo_item" />
          <a
            href="/chats"
            style={currentPage === "chats" ? { color: "#240f6a" } : { color: "#8c6df7" }}
            className="item_name"
          >
            My Chats
          </a>
        </div>
}
        {
          users?.isloggedin &&
        <div className="item">
          <CiUser className="logo_item" />
          <a
            href="/profile"
            style={currentPage === "profile" ? { color: "#240f6a" } : { color: "#8c6df7" }}
            className="item_name"
          >
            My Profile
          </a>
        </div>
}
        {
          users?.isloggedin &&
        <div className="item" onClick={logouthandler}>
          <CiLogout className="logo_item" />
          <h3 style={{ color: "#8c6df7" }} className="item_name">Logout</h3>
        </div>
}
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default Navbar;
