const mongoose = require("mongoose");

const MessageSchema=new mongoose.Schema({
   members:{
    type:[String],
    required:true
   },
    text:{
        type:String,
        required:true
    },
    senderName:{
        type:String
    },
    file:{
        type:String,
        required:false
    }
},
{timestamps:true})
module.exports=mongoose.model('message',MessageSchema);