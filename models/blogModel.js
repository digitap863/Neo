const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title:String,
  content:String,
  images:String
},
{
  timestamps:true
});

const blogModel= mongoose.model("blogs", blogSchema);
module.exports = blogModel;
 