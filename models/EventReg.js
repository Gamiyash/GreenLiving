const mongoose = require('mongoose');

const eventRegSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
}, { timestamps: true });

const EventReg = mongoose.model('EventReg', eventRegSchema);

module.exports = EventReg;
