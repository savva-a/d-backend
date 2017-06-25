const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
// const utils = require('../utils');
// const path = require('../path');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let promotion = req.body.promotion;
  const code = req.body.code;

  session = _await(model.UserSession.findOne({ _id: session }).populate({
    model: 'User',
    path: 'user'
  }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  promotion = _await(model.Promotion.findOne({ _id: promotion, redeemCode: code }).exec());
  if (!promotion) return API.fail(res, API.errors.INVALID_REDEEM_CODE);


  const usedCoupons = session.user.redeemed
  .filter(x => `${x}` === `${promotion._id}`).length;
  if (usedCoupons + 1 > promotion.couponsQty) {
    return API.fail(res, API.errors.REDEEM_LIMIT);
  }
  promotion.redeemQty += 1;
  _await(promotion.save());

  session.user.redeemed.push(promotion);
  const user = _await(session.user.save());

  return API.success(res, user);
});
