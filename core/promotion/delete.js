const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let promotion = req.body.promotion;

  session = _await(model.UserSession.findOne({ _id: session }).populate('user').exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  promotion = _await(model.Promotion.findOne({ _id: promotion }).exec());
  if (!promotion) return API.fail(res, API.errors.NOT_FOUND);

  const restaurant = _await(model.Restaurant.findOne({ _id: promotion.restaurant }).exec());

  const idx = restaurant.promotions.indexOf(req.body.promotion);
  restaurant.promotions.splice(idx, 1);

  _await(promotion.remove());
  _await(restaurant.save());

  const users = _await(model.User.find(
    { $or: [
      { saved: promotion },
      { redeemed: promotion }
    ] }).exec());

  users.forEach((user) => {
    while (user.saved.indexOf(promotion._id) !== -1) {
      user.saved.splice(user.saved.indexOf(promotion._id), 1);
    }

    while (user.redeemed.indexOf(promotion._id) !== -1) {
      user.redeemed.splice(user.redeemed.indexOf(promotion._id), 1);
    }
    _await(user.save());
  });

  return API.success(res, `Promotion ${req.body.promotion} has been removed`);
});
