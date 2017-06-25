const mongoose = require('mongoose');

module.exports = mongoose.model('Order', mongoose.Schema({
  buyer: { type: mongoose.Schema.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
  seller: { type: mongoose.Schema.ObjectId, ref: 'User', select: false },
  orderId: { type: Number, index: { unique: true } },
  quantity: { type: Number },
  promo: {
    name: { type: String },
    code: { type: String },
    discount: { type: Number },
    percent: { type: Number }
  },
  totalPrice: { type: Number },
  productPrice: { type: Number },
  orderStatuses: [{ type: mongoose.Schema.ObjectId, ref: 'OrderStatus' }],
  isUnreadByBuyer: { type: Boolean, default: false },
  isUnreadBySeller: { type: Boolean, default: true }
}));
