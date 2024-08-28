const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendEmailVerificationMail.js")
const otpGenerator = require('otp-generator');
const sendForgetMail = require("../utils/sendForgetPaswordEmail.js");
const users = require("../models/user.js");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email,isDoctor,appointmentFee, password,specialisation } = req.body;

  if (!email || !name || !password) {
    res.status(200).json({ success: false, message: "Provide all details during registration..." });
    return;
  }

  if(isDoctor===true){
 if(!specialisation || !appointmentFee){
    return res.status(200).json({ success: false, message: "Provide appointment fees and Specialisation for doctor" });
 
  } 
  }
  const userExists = await users.findOne({ email });

  if (userExists) {
    res.status(200).json({ success: false, message: "User already exists" });
  }
  const hashedpassword = await bcrypt.hash(req.body.password, 10);
  const code = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
  const expireDate = new Date(Date.now() + 10 * 60000).toISOString();
 

  let obj={
    name: req.body.name,
    email: req.body.email,
    password: hashedpassword,
    VerficationCode:code,
    VerificationCodeExpires: expireDate,
    isVerified: false,
    ForgetPasswordCode: "",
    ForgetPasswordCodeExpires: "",
  };

  if(isDoctor===true){
    obj.appointmentCharge=req.body.appointmentFee;
    obj.role="doctor"
    obj.specialisation=req.body.specialisation;
  }

  const newUser = new users(obj);


  const user = await newUser.save();
  // await sendEmail(email, code);


  res.status(200).json({"success":true,"message":"user created successfully !"});
});


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(200).json({ success: false, message: "Provide email and password" });
  }

  // Find user by email
  const user = await users.findOne({ email });
  if (!user) {
    return res.status(200).json({ success: false, message: "Invalid Email or Password !" });
  }

  // Validate password
  const validate = await bcrypt.compare(password, user.password);
  if (!validate) {
    return res.status(200).json({ success: false, message: "Invalid Email or Password !" });
  }

  // Check if the user is verified
  if (!user.isVerified) {
    const code = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    const expireDate = new Date(Date.now() + 10 * 60000).toISOString(); // 10 minutes expiration

    // Update user with verification code and expiration date
    await users.updateOne(
      { email },
      { $set: { VerificationCode: code, VerificationCodeExpires: expireDate } } // Correct field names
    );

    // Optionally send verification email
    // await sendEmail(email, code);

    return res.status(200).json({ success: false, message: 'Before you can log in, please verify your email address. Kindly check your inbox for a verification link.' });
  }

  // Generate JWT token
  const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "10h", // 10 hours
  });

  // Set cookie with JWT token
  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 36000), // 10 hours
    httpOnly: true,
    sameSite: "none",
    secure:true
    // secure: process.env.NODE_ENV === "production" // Uncomment if using HTTPS
  });

  return res.status(200).json({ success: true, message:user  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { code, email } = req.body;

  if (!email || !code) {
    return res.status(200).json({ success: false, message: "Provide Code and Email" });
  }
  const user=await users.findOne({"email":email,"VerficationCode":req.body.code});
  if(user!==null  && user.VerificationCode === code && user.VerificationCodeExpires > new Date().toISOString()){
   await users.updateOne({"email":email,"VerficationCode":req.body.code},{"isVerified":true,"VerficationCode":"","VerificationCodeExpires":""})  ;
  
   res.status(200).json({ success: true, message: "Verification Successfull" });
 
  }else{
   res.status(200).json({"success":false,"message":"wrong or expired  VerificationCode provided"})
  }
 })

const logout = asyncHandler(
  asyncHandler(async (req, res) => {
    res.clearCookie('token')
    req.cookies.token = ''
    res.status(200).json({ "success": true, "message": "logout successfully" })
  })
);

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await users.findById(req.user._id);
  
    if (user) {
      res.json({
        "success":true,"message":user });
    } else {
      res.status(200).json({ success: false, message: "User not found !" });
    }
});

const getUserById=asyncHandler(async(req,res)=>{
  const {id}=req.body;
  if(!id){
    return res.status(200).json({ success: false, message: "Provide user id !" });
  }
  const user = await users.findById(id).select('-password');
  if (user) {
    res.json({
      "success":true,"message":user });
  } else {
return res.status(200).json({ success: false, message: "User not found !" });
  }
} 
)

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name} = req.body;
  const { _id } = req.user; // Assuming you have the user's _id in your request

  const user = await users.findById(req.user._id);

  if (user) {
    const t=await users.findByIdAndUpdate(req.user._id,{
      name:req.body.name
    })


    res.json({
      success: true,
      message: updatedUser.Attributes
    });
  } else {
    res.status(200).json({ success: false, message: "User not found" });
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
const user=await users.findOne({"email":email});

  if (!user) {
    return res.status(200).json({ success: false, message: 'User not found!' });
  }
  const code = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
  const expireDate = new Date(Date.now() + 10 * 60000).toISOString();

 await users.updateOne({"email":email},{"ForgetPasswordCode":code,"ForgetPasswordCodeExpires":expireDate});

  // await sendForgetMail(email, code);

  res.status(200).json({ success: true, message: "Instructions for resetting your password have been sent to your email" });
});

const resetpassword = asyncHandler(async (req, res) => {
  const { Newpassword, code, email } = req.body;


  if (!email || !code) {
    return res.status(200).json({ success: false, message: "Provide Code and Email" });
  }
  const user = await users.findOne({ "email": email,"ForgetPasswordCode":code });

  if (user && user.ForgetPasswordCode === code && user.ForgetPasswordCodeExpires > new Date().toISOString()) {
    const hashedpassword = await bcrypt.hash(req.body.Newpassword, 10);
    await users.updateOne({ "email":email,"ForgetPasswordCode":code }, { "password": hashedpassword, "ForgetPasswordCode": "", "ForgetPasswordCodeExpires": "" });

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } else {
    res.status(200).json({ success: false, message: "Invalid or expired token provided" });
  }
});
const getAllPatients = async (req, res) => {
  try {
    const u = await users.find({ role: 'patient' }); // Find all users
    res.status(200).json({
      success: true,
      message:u,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(200).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const u = await users.find({ role: 'doctor' }); // Find users where role is 'doctor'
    res.status(200).json({
      success: true,
      message:u,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(200).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  logout,
  updateUserProfile,
  resetpassword,
  forgetPassword,
  verifyEmail,
  getAllDoctors,
  getUserById,
  getAllPatients
};
