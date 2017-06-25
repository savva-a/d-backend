const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let users;
  const chefs = [];
  const buyers = [];

  try {
    session = _await(model.AdminSession.findOne({ _id: session }).exec());
    if (!session) return API.fail(res, API.errors.UNAUTHORIZED);
  } catch (e) {
    return API.fail(res, API.errors.UNAUTHORIZED);
  }

  users = _await(model.User.find().populate('location').sort({ _id: -1 }).exec());
  if (!users) users = [];

  users.forEach((user) => {
    if (user.isRestaurant) {
      chefs.push(user);
    } else {
      buyers.push(user);
    }
  });

  return API.success(res, { chefs, buyers });
});
