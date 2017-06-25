const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');


module.exports = _async((req, res) => {
  let session = req.body.session;
  let promotion = req.body.promotion;

  session = _await(model.UserSession.findOne({ _id: session }).populate({
    model: 'User',
    path: 'user'
  }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  promotion = _await(model.Promotion.findOne({ _id: promotion }).exec());
  if (!promotion) return API.fail(res, API.errors.PROMOTION_NOT_FOUND);

  const idx = session.user.saved.indexOf(req.body.promotion);
  if (idx !== -1) {
    session.user.saved.splice(idx, 1);
    promotion.saves -= 1;
  } else {
    session.user.saved.push(promotion);
    promotion.saves += 1;
  }
  _await(promotion.save());
  const user = _await(session.user.save());
  return API.success(res, user);
});
