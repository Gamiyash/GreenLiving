const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false,
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now
  },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  birthday: { type: Date, required: false }
  
});
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', UserSchema);