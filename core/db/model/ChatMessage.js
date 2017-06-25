const mongoose = require('mongoose');

module.exports = mongoose.model('ChatMessage', mongoose.Schema({
  from: { type: mongoose.Schema.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.ObjectId, ref: 'User' },
  text: { type: String },
  image: { type: String },
  imageThumbnail: { type: String },
  dialog: { type: mongoose.Schema.ObjectId, ref: 'ChatDialog' },
  date: { type: Date, default: Date.now() }
}));
