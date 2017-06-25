const mongoose = require('mongoose');

module.exports = mongoose.model('Feedback', mongoose.Schema({
  userName: { type: String },
  category: { type: mongoose.Schema.ObjectId, ref: 'FeedbackCategory' },
  description: { type: String },
  date: { type: Date, default: Date.now() }
}));
