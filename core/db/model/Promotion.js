const mongoose = require('mongoose');

const PromotionSchema = mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  discont: { type: Number },
  description: { type: String },
  terms: { type: String },
  picture: { type: String },
  redeemCriteria: { type: String },
  restaurant: { type: mongoose.Schema.ObjectId, ref: 'Restaurant' },
  expiredDate: { type: Date },
  period: { type: Number },
  status: { type: String, enum: ['active', 'draft', 'expired', 'deactivated'], default: 'draft' },
  couponsQty: { type: Number },
  redeemCode: { type: String },
  redeemCodeLength: { type: Number, default: 0 },
  promotionTime: { type: String, enum: ['9pm12am', '5pm9pm', '2pm5pm', '11am2pm', '10am12pm', '6am10am', 'wholeDay'], default: 'wholeDay' },
  redeemQty: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  saves: { type: Number, default: 0 }
});

const preValidateCb = function preValidateCb(next) {
  const promotion = this;
  const possibleVals = PromotionSchema.path('status').enumValues;

  if (promotion.isModified('status')) {
    if (possibleVals.indexOf(promotion.status) === -1) {
      promotion.status = 'draft';
    }
  }
  if (promotion.isModified('redeemCode')) {
    promotion.redeemCodeLength = promotion.redeemCode.length;
  }
  return next();
};
PromotionSchema.pre('validate', preValidateCb);

module.exports = mongoose.model('Promotion', PromotionSchema);
