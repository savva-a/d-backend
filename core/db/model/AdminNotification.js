const mongoose = require('mongoose');

module.exports = mongoose.model('AdminNotification', mongoose.Schema({
  text: { type: String },
  date: { type: Date, default: Date.now() }
}));
