const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',  // Assuming 'User' model is used for both patients and doctors
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  slot:{
    type:Number,
    required:true
  }
},{
    timestamps:true
});


const Appointment = mongoose.model('appointment', appointmentSchema);

module.exports = Appointment;
