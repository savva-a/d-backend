const mongoose = require('mongoose');

module.exports = mongoose.model('OrderStatus', mongoose.Schema({
  value: { type: String },
  date: { type: Date, default: Date.now() }
}));
