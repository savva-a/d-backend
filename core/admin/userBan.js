const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let user = req.body.user;

  session = _await(model.AdminSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  user = _await(model.User.findOne({ _id: user }).populate('location').exec());
  if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);

  if (user.banned === true) {
    user.banned = false;
  } else if (user.banned === false) {
    user.banned = true;
  } else {
    return API.fail(res, API.errors.UNKNOWN);
  }

  user = _await(user.save());
  return API.success(res, { user });
});
