const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  const mail = req.body.mail;
  const password = req.body.password;

  if (!mail || !password) return API.fail(res, API.errors.MISSED_FIELD);

  const admin = _await(model.Admin.findOne({ mail }).select('+password').exec());
  if (!admin) return API.fail(res, API.errors.USER_NOT_FOUND);

  return admin.comparePassword(password, (error, isMatch) => {
    if (error) {
      return API.fail(res, API.errors.UNKNOWN);
    }

    if (!isMatch) {
      return API.fail(res, API.errors.USER_PASSWORD_NOT_MATCH);
    }

    const session = new model.AdminSession({
      admin: admin._id
    });

    return session.save().then((_session) => {
      API.success(res, {
        session: _session._id,
        name: admin.name,
        mail: admin.mail,
        _id: admin._id
      });
    });
  });
});
