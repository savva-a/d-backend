const _async = require('asyncawait/async');
const _await = require('asyncawait/await');
const moment = require('moment');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');
// const path = require('../path');

module.exports = _async((req, res) => {
  let session = req.body.session;
  const mail = req.body.mail;
  const name = req.body.name;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const phone = req.body.phone;
  const country = req.body.country;
  const gender = req.body.gender;
  const showMail = req.body.showMail;
  const showPhone = req.body.showPhone;
  const date = req.body.following ? moment(req.body.date).format() : null;
  const following = req.body.following ? JSON.parse(req.body.following) : null;
  const saved = req.body.saved ? JSON.parse(req.body.saved) : null;
  const redeemed = req.body.redeemed ? JSON.parse(req.body.redeemed) : null;

  let files;

  session = _await(model.UserSession.findOne({ _id: session }).populate({
    model: 'User',
    path: 'user',
  }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  if (req.files && req.files.file) {
    files = req.files.file;
    if (!files.length) {
      files = [files];
    }
  }

  if (!(mail ||
      name ||
      firstName ||
      lastName ||
      // phone ||
      showMail ||
      showPhone ||
      date ||
      following ||
      redeemed ||
      saved ||
      files)
    ) return API.fail(res, API.errors.MISSED_FIELD);
  if (name && utils.validateName(name)) return API.fail(res, API.errors.INVALID_NAME);

  if (mail && !utils.validateEmail(mail)) return API.fail(res, API.errors.INVALID_EMAIL_ADDRESS);

  // if (phone && !Number(phone)) {
  //   return API.fail(res, API.errors.INVALID_PHONE_NUMBER);
  // }
  session = _await(model.UserSession.findOne({ _id: session }).populate({
    model: 'User',
    path: 'user',
  }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  if (files) {
    const arr = files[0].path.split('/');
    session.user.icon = arr[arr.length - 1];
  }

  if (phone) {
    const userPhoneCheck = _await(model.User.findOne({ phone }).exec());
    if (userPhoneCheck && `${userPhoneCheck._id}` !== `${session.user._id}`) return API.fail(res, API.errors.PHONE_NUMBER_EXIST);
  }
  if (mail) {
    const userMailCheck = _await(model.User.findOne({ mail }).exec());
    if (userMailCheck && `${userMailCheck._id}` !== `${session.user._id}`) return API.fail(res, API.errors.EMAIL_EXIST);
  }


  utils.assign(session.user, { mail });
  utils.assign(session.user, { name });
  utils.assign(session.user, { firstName });
  utils.assign(session.user, { lastName });
  utils.assign(session.user, { phone });
  utils.assign(session.user, { country });
  utils.assign(session.user, { showMail });
  utils.assign(session.user, { showPhone });
  utils.assign(session.user, { date });
  utils.assign(session.user, { gender });
  utils.assign(session.user, { following });
  utils.assign(session.user, { redeemed });
  utils.assign(session.user, { saved });

  const user = _await(session.user.save());
  return API.success(res, user);
});
