const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  index: { type: Number },
  productsCounts: { type: Number, default: 0 }
});

module.exports = mongoose.model('Category', CategorySchema);
