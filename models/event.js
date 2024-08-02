// models/event.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  title: String,
  des: String,
  date:String,
  agenda1:String,
  agenda2: String,
  agenda3:String,
  agenda4:String,
  agenda5:String,
  spname:String,
  spdes:String,
  spimg:String,
  spname2:String,
  spdes2:String,
  spimg2:String,
  loc:String,
  mainimg:String,
  reg_link:String
});

const events = mongoose.model('events', dataSchema);

module.exports = events;
