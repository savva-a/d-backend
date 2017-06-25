const mongoose = require('mongoose');

module.exports = mongoose.model('ChatDialog', mongoose.Schema({
  user0: { type: mongoose.Schema.ObjectId, ref: 'User' },
  user1: { type: mongoose.Schema.ObjectId, ref: 'User' },
  lastMessage: { type: mongoose.Schema.ObjectId, ref: 'ChatMessage' },
  lastMessageDate: { type: Date },
  unreadMessagesUser0: { type: Number, default: 0 },
  unreadMessagesUser1: { type: Number, default: 0 },
  isUser0Deleted: { type: Boolean, default: false },
  isUser1Deleted: { type: Boolean, default: false },
  dateUser0Deleted: { type: Date },
  dateUser1Deleted: { type: Date }
}));
