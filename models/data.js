// models/User.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  title: String,
  des: String,
  title2:String,
  des2:String,
  imageUrl: String,
  img1:String,
  img2:String,
  img3:String,
  img4:String,
  img5:String,
  mainimg:String,
  logo:String,
  title3:String,
  des3:String
  // Add other fields as needed
});

const echo = mongoose.model('echos', dataSchema);

module.exports = echo;
