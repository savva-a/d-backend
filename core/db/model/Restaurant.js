const mongoose = require('mongoose');

const RestaurantSchema = mongoose.Schema({
  restaurantName: { type: String },
  description: { type: String, default: '' },
  website: { type: String, default: '' },
  country: { type: String, default: '' },
  logo: { type: String, default: '' },
  restaurantMail: { type: String, default: '' },
  businessRegNum: { type: String },
  type: { type: String },
  postalCode: { type: String },
  address: { type: String },
  unitNumber: { type: String },
  phone: { type: String },
  optHours: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  alreadyVerified: { type: Boolean, default: false },
  coordinate: { type: Object },
  followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  promotions: [{ type: mongoose.Schema.ObjectId, ref: 'Promotion' }],
  promotionsQty: { type: Number, default: 0 }
});

const preSaveCb = function preSaveCb(next) {
  const restaurant = this;
  // save qty of promotions
  restaurant.promotionsQty = restaurant.promotions.length;
  return next();
};
RestaurantSchema.pre('save', preSaveCb);

module.exports = mongoose.model('Restaurant', RestaurantSchema);
