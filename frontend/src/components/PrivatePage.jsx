import { useDispatch, useSelector } from 'react-redux'
import {  setdata, setisLoggedin } from '/redux/reducers/userSlice'
import { useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate();


  const checkSession=async()=>{
    try{

    const resp=await axios.get("https://medi-connect-backend.onrender.com/auth/isLoggedin");
    
    if(resp.data.success==true){
      dispatch(setisLoggedin(true))
      dispatch(setdata(resp.data.message));
    }else{
      dispatch(setisLoggedin(false))
      dispatch(setdata(null))
      navigate("/login")
    }
    
  }catch(e){
    toast.error("Something went wrong")
    navigate("/login")

  }
   }

  useEffect(()=>{
   checkSession()
  },[navigate])

  return children;
};

export default ProtectedRoute;
