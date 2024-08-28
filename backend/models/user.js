const  mongoose =require('mongoose')


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type:String,
      required: true,
      default: "patient", 
      enum: ["patient", "doctor"], 
    },
    isVerified:{
      type:Boolean,
      default:false
    },
    VerficationCode:{
      type:String,
    },
    VerificationCodeExpires:{
      type:Date,
    },
    ForgetPasswordCode:{
      type:String,
    },
    ForgetPasswordCodeExpires:{
      type:Date,
    },
    appointmentCharge:{
      type:String,
      required:false
    },
    specialisation:{
      type:String,
      required:false
    }
  },
  {
    timestamps: true,
  }
)

const users = mongoose.model('users', userSchema)

module.exports= users
