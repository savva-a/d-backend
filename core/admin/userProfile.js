const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let user = req.body.user;
  let products;

  session = _await(model.AdminSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  user = _await(model.User.findOne({ _id: user }).populate('location').exec());
  if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);

  products = _await(model.Product.find({ user: user._id }).populate('category').exec());
  if (!products) products = [];

  utils.assign(user, { products });
  return API.success(res, { user });
});
