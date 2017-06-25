const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  name: { type: String },
  text: { type: String },
  tokens: { type: String },
  // delivery: { type: Boolean, default: false },
  // deliveryOptions: { type: String },
  // comments: [{ type: mongoose.Schema.ObjectId, ref: 'ProductComment' }],
  // date: { type: Date, default: new Date() },
  // pictures: { type: Array },
  // picturesThumbnails: { type: Array },
  // price: { type: String },
  // selfCollect: { type: Boolean, default: false }
});

module.exports = mongoose.model('Book', BookSchema);
