 const mongoose = require('mongoose');

 const AppointSchema = new mongoose.Schema({
user :{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
doctor :{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Doctor"
},
date:String,
reason:String,

 })
   
 const Appoint = mongoose.model("Appoint" , AppointSchema)
  module.exports = Appoint