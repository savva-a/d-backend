const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;


  session = _await(model.UserSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  let user = _await(model.User.findOne({ _id: session.user }).select('+password').exec());

  return user.comparePassword(oldPassword, _async((error, isMatch) => {
    if (error) {
      return API.fail(res, API.errors.UNKNOWN);
    }

    if (!isMatch) {
      return API.fail(res, API.errors.USER_PASSWORD_NOT_MATCH);
    }
    user.password = newPassword;

    user = _await(user.save());
    return API.success(res, user);
  }));
});
