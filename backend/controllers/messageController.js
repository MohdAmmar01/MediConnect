const router = require('express').Router();
const Message = require('../models/message');
const Appointment = require('../models/appointment'); // Assuming your schema is in this file
const moment = require('moment-timezone');
// Create message
const createMessage = async (req, res) => {
  try {
    const { members, text, senderName } = req.body;

    // Ensure members is parsed correctly
    const parsedMembers = JSON.parse(members);

    // Validate required fields
    if (!parsedMembers || parsedMembers.length !== 2 || !text || !senderName) {
      return res.status(200).json({ 
        success: false, 
        message: "Provide all details including two members, text, and sendername." 
      });
    }

    const [senderId, receiverId] = parsedMembers;

    // Handle file upload if any
    let file = '';
    if (req.file && req.file.originalname) {
      file = `${process.env.BACKEND_URL}/files/${req.user._id}${new Date().getHours()}${req.file.originalname.replace(/\s+/g, '_').toLowerCase()}`;
    }

    // Create message object
    const messageData = {
      members: [senderId, receiverId],
      text,
      senderName,
      file
    };

    // Save the message
    const message = new Message(messageData);
    const savedMessage = await message.save();

    // Return success response with saved message
    res.status(200).json({ success: true, message: savedMessage });

  } catch (error) {
    console.error('Error in createMessage:', error);
    res.status(500).json({ success: false, message: "An error occurred while creating the message.", error: error.message });
  }
};


// Get messages of user
const getMessagesOfUser = async (req, res) => {
  try {
    let {members}=req.body;

    if(!members){
      return res.status(200).json({ success: false, message: "Provide all details!" });
    }else if(members.length!=2){
      return res.status(200).json({ success: false, message: "Provide only two members!" });
    }
    const m = await Message.find({ members: { $all: members } });
    res.status(200).json({ success: true, message: m });
  } catch (e) {
    res.status(400).json({ success: false, message: "Some error occurred", error: e.message });
  }
};
const canChat = async (req, res) => {
  try {
    const { userId, doctorId } = req.body;

    if (!userId || !doctorId) {
      return res.status(200).json({ success: false, message: "User ID and Doctor ID are required" });
    }

    // Get current date and time in 'Asia/Kolkata' timezone
    const currentDateTime = moment.tz("Asia/Kolkata");
    const currentDate = currentDateTime.format("MM/DD/YYYY"); // Format to match your date format

    const currentHour = currentDateTime.hour(); // Get the hour part in 'Asia/Kolkata' timezone

    let currentSlot;
    if (currentHour >= 9 && currentHour < 16) {
      currentSlot = "0";
    } else if (currentHour >= 15 && currentHour < 18) {
      currentSlot = "1";
    } else if (currentHour >= 21 && currentHour < 23) {
      currentSlot = "2";
    } else {
      return res.status(200).json({ success: false, message: "Chat is only allowed during appointment slots" });
    }

    const activeAppointment = await Appointment.findOne({
      patientId: userId,
      doctorId: doctorId,
      date: currentDate,
      slot: currentSlot,
    });

    if (activeAppointment) {
      return res.status(200).json({ success: true, message: "Chat allowed" });
    } else {
      return res.status(200).json({ success: false, message: "No active appointment found, chat not allowed" });
    }
  } catch (e) {
    console.error('Error in canChat:', e.message); // Log the error for debugging
    res.status(500).json({ success: false, message: "An error occurred while checking chat permission", error: e.message });
  }
};

module.exports = {
  createMessage,
  getMessagesOfUser,
  canChat, // Export the new controller
};
