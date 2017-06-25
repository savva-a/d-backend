const mongoose = require('mongoose');

const AdminSessionSchema = mongoose.Schema({
  admin: { type: mongoose.Schema.ObjectId, ref: 'Admin' }
});

module.exports = mongoose.model('AdminSession', AdminSessionSchema);
