const express = require('express')
const router = express.Router()
const {createMessage,getMessagesOfUser} = require('../controllers/messageController.js')


const multer = require('multer')
const { canChat } = require('../controllers/messageController.js')
const { protect } = require('../middleware/authMiddleware.js')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files')
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}${new Date().getHours()}${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

router.post('/create-message',protect, upload.single('file'),createMessage)
router.post('/getMessagesOfUser', protect,getMessagesOfUser)
router.post('/canChat',protect, canChat)



module.exports = router
