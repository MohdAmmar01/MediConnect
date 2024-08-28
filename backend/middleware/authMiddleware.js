const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const users = require('../models/user');


const protect = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies.token;
  if (!cookie) {
    return res.status(200).json({ "success": false, "message": 'Token not found' });
  }
  const decodedToken = jwt.verify(cookie, process.env.SECRET_KEY);
const user=await users.findById(decodedToken._id);

  

  if (!user) {
    return res.status(200).json({ "success": false, "message": 'User not found !' });
  }
  else {
  
    req.user=user;
    next();
}
 
});
const isDOctor = (req, res, next) => {
  if (req.user && req.user.role=="doctor") {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an doctor !')
  }
}
module.exports = { protect,isDOctor };