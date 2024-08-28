const express = require('express')
const { createAppointment, getAppointmentsOfUser } = require('../controllers/appointmentControllers')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()



router.post('/create-appointment',protect,createAppointment)
router.post('/getAppointmentsOfUser',protect,getAppointmentsOfUser)


module.exports = router
