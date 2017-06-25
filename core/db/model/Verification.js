const mongoose = require('mongoose');

module.exports = mongoose.model('Verification', mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  code: { type: String },
  date: { type: Date, default: Date.now() }
}));
