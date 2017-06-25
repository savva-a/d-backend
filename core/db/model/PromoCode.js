const mongoose = require('mongoose');

module.exports = mongoose.model('PromoCode', mongoose.Schema({
  name: { type: String },
  users: { type: Array, select: false }, // [{ type: mongoose.Schema.ObjectId, ref: 'User'}] user
  ordersIds: { type: Array, select: false }, // [orderId] user
  categoriesIndexes: [{ type: Number }], // admin
  code: { type: String, index: { unique: true } },
  startDate: { type: Date, default: Date.now() },
  expiredDate: { type: Date },
  isFixed: { type: Boolean, default: true },
  value: { type: Number },
  isActive: { type: Boolean, default: true },
  isOncePerUser: { type: Boolean, default: false }
}));
