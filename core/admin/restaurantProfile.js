const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let restaurant = req.body.restaurant;

  session = _await(model.AdminSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  restaurant = _await(model.Restaurant.findOne({ _id: restaurant }).exec());
  if (!restaurant) return API.fail(res, API.errors.NOT_FOUND);

  return API.success(res, { restaurant });
});
