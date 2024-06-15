const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  firstName:String,
  lastName:String,
  address:String,
  town:String,
  state:String,
  pincode:String,
  email:String,
  phone:String,
  lineItems:Array,
  done:{
    type:Boolean,
    default:false
  },
  total:Number,
  orderId:String,
  paymentStatus:String
},
{   
  timestamps:true
});

const orderModel = mongoose.model("Orders", orderSchema);
module.exports = orderModel;
 