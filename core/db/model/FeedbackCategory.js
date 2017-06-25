const mongoose = require('mongoose');

module.exports = mongoose.model('FeedbackCategory', mongoose.Schema({
  index: { type: String },
  feedbacksCounts: { type: Number, default: 0 }
}));
