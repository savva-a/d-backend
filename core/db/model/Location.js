const mongoose = require('mongoose');

module.exports = mongoose.model('Location', mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  coordinate: { type: Object },
  placeId: { type: String },
  text: { type: String }
  // country: { type: String},
  // city: { type: String},
  // streetName: { type: String},
  // streetNumber: { type: String}
}));
