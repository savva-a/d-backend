const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let promotion = req.body.promotion;
  let session = req.body.session;

  session = _await(model.UserSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  promotion = _await(model.Promotion.findOne({ _id: promotion }).exec());
  if (!promotion) return API.fail(res, API.errors.NOT_FOUND);

  promotion.views += 1;
  promotion = _await(promotion.save());

  return API.success(res, { msg: 'ok' });
});
