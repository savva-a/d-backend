const mongoose = require('mongoose');

const UserSessionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('UserSession', UserSessionSchema);
