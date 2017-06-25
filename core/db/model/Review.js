const mongoose = require('mongoose');

module.exports = mongoose.model('Review', mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  order: { type: mongoose.Schema.ObjectId, ref: 'Order' },
  chefText: { type: String },
  buyerText: { type: String },
  chefRating: { type: Number },
  buyerRating: { type: Number },
  isChefSubmitted: { type: Boolean, default: false },
  isBuyerSubmitted: { type: Boolean, default: false },
  date: { type: Date, default: Date.now() }
}));
