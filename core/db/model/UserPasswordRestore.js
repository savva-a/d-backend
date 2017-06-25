const mongoose = require('mongoose');

const UserPasswordRestoreSchema = mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  code: { type: String },
  date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('UserPasswordRestore', UserPasswordRestoreSchema);
