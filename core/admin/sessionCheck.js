const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;

  if (!session) return API.fail(res, API.errors.USER_NOT_FOUND);

  session = _await(model.AdminSession.findOne({ _id: session }).populate('admin').exec());
  if (session) {
    return API.success(res, {
      session: session._id,
      _id: session.admin._id,
      name: session.admin.name,
      mail: session.admin.mail
    });
  }
  return API.fail(res, API.errors.UNAUTHORIZED);
});
