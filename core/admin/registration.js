const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let session = req.body.session;
  const mail = req.body.mail;
  const password = req.body.password;

  if (!mail || !password || !mail.length || !password.length) {
    return API.fail(res, API.errors.MISSED_FIELD);
  }
  if (!utils.validateEmail(mail)) return API.fail(res, API.errors.INVALID_EMAIL_ADDRESS);
  session = _await(model.AdminSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  const admin = _await(model.Admin.findOne({ mail }).exec());
  if (admin) return API.fail(res, API.errors.USER_EXIST);

  let newAdmin = new model.Admin({
    mail,
    password
  });

  newAdmin = _await(newAdmin.save());

  return API.success(res, {
    _id: newAdmin._id,
    mail: newAdmin.mail
  });
});
