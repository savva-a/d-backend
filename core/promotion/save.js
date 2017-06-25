const _async = require('asyncawait/async');
const _await = require('asyncawait/await');
const moment = require('moment');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let promotion = req.body.promotion;
  const name = req.body.name;
  const price = req.body.price;
  const discont = req.body.discont;
  const description = req.body.description;
  const terms = req.body.terms;
  const redeemCriteria = req.body.redeemCriteria;

  let restaurant = req.body.restaurant;
  const expiredDate = req.body.expiredDate ? moment(req.body.expiredDate).format() : null;
  const period = req.body.period;
  const status = req.body.status;
  let picture = req.body.picture;
  const couponsQty = req.body.couponsQty;
  const redeemCode = req.body.redeemCode;
  const redeemQty = req.body.redeemQty;
  const promotionTime = req.body.promotionTime;

  session = _await(model.UserSession.findOne({ _id: session }).populate('user').exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);
  if (!picture) {
    if (req.files && req.files.file) {
      const arr = req.files.file.path.split('/');
      picture = arr[arr.length - 1];
    }
  }

  if (!promotion) {
    if (!price ||
        !discont ||
        !redeemCriteria ||
        !couponsQty ||
        !redeemCode ||
        !promotionTime ||
        !expiredDate ||
        !period ||
        !status ||
        !restaurant
      ) {
      return API.fail(res, API.errors.MISSED_FIELD);
    }

    promotion = new model.Promotion({
      name,
      price,
      discont,
      description,
      terms,
      redeemCriteria,
      couponsQty,
      redeemCode,
      promotionTime,
      expiredDate,
      period,
      status,
      restaurant,
      redeemQty,
      picture,
    });

    restaurant = _await(model.Restaurant.findOne({ _id: restaurant }).exec());
    if (!restaurant) return API.fail(res, API.errors.NOT_FOUND);
    restaurant.promotions.push(promotion);
    restaurant = _await(restaurant.save());
  } else {
    promotion = _await(model.Promotion.findOne({ _id: promotion }).exec());
    if (!promotion) return API.fail(res, API.errors.NOT_FOUND);
    utils.assign(promotion, { description });
    utils.assign(promotion, { terms });
    utils.assign(promotion, { redeemCode });
    utils.assign(promotion, { promotionTime });
    utils.assign(promotion, { price });
    utils.assign(promotion, { discont });
    utils.assign(promotion, { couponsQty });
    utils.assign(promotion, { expiredDate });
    utils.assign(promotion, { period });
    utils.assign(promotion, { status });
    utils.assign(promotion, { picture });
  }

  if (!session.user.isRestaurant && promotion.status === 'active') {
    promotion.status = 'draft';
  }
  promotion = _await(promotion.save());
  return API.success(res, promotion);
});
