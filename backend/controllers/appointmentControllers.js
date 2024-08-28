const Appointment = require('../models/appointment'); // Assuming your schema is in this file
const User = require('../models/user'); // Assuming you have a User model
const crypto=require('crypto');
const axios=require('axios');

// Create an appointment
const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, slot,date } = req.body;
        
      // Validate required fields
      if (!patientId || !doctorId || !slot || !date) {
        return res.status(200).json({success:false, message: 'All fields are required' });
      }
    
      // Check if patient and doctor exist
      const patient = await User.findById(patientId);
      const doctor = await User.findById(doctorId);
    
      if (!patient || !doctor) {
        return res.status(200).json({success:false, message: 'Patient or Doctor not found' });
      }
       
      let app=await Appointment.findOne({date:date,slot:slot,doctorId:doctorId});
      if(app){
        return res.status(200).json({success:false,message:"Slot already booked !"})
      }
    // Create new appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      slot,
    });

    // Save appointment to the database
    await newAppointment.save();

    res.status(200).json({
      success:true,
      message: 'Appointment created successfully',
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({success:false, message: 'something went wrong !' });
  }
};

// Get all appointments of a user (patient or doctor)
const getAppointmentsOfUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(200).json({success:false, message: 'User ID is required' });
    }

    // Find all appointments where the user is either the patient or doctor
    const appointments = await Appointment.find({
      $or: [{ patientId: userId }, { doctorId: userId }],
    })
      .populate('patientId', 'name email') // Replace 'name email' with fields you want to populate
      .populate('doctorId', 'name email');

    res.status(200).json({
      success:true,
      message:appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(200).json({success:false, message: 'Server error' });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsOfUser,
};
