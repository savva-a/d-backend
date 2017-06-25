const mongoose = require('mongoose');

module.exports = mongoose.model('ProductComment', mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  text: { type: String },
  date: { type: Date, default: new Date() }
}));
