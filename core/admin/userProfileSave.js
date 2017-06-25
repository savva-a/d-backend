const _async = require('asyncawait/async');
const _await = require('asyncawait/await');
const fs = require('fs');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');
const path = require('../path');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let user = req.body.user;
  const name = req.body.name;
  const info = req.body.info;
  const banner = req.body.banner;
  const icon = req.body.icon;
  const phone = req.body.phone;
  const mail = req.body.mail;
  let location = req.body.location;
  let products;

  if (!utils.validateEmail(mail)) return API.fail(res, API.errors.INVALID_EMAIL_ADDRESS);
  if (utils.validateName(name)) return API.fail(res, API.errors.INVALID_NAME);
  if (
    !Number(phone) ||
    phone.toString().length !== 8 ||
    (!phone.toString().startsWith('8') &&
    !phone.toString().startsWith('9'))) {
    return API.fail(res, API.errors.INVALID_PHONE_NUMBER);
  }

  session = _await(model.AdminSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  user = _await(model.User.findOne({ _id: user }).populate('location').exec());
  if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);

  products = _await(model.Product.find({ user: user._id }).exec());
  if (!products) products = [];

  user.name = name;
  user.info = info;
  if (location) {
    const _location = JSON.parse(location);
    user.location.coordinate = _location.coordinate;
    user.location.text = _location.text;
    user.location.placeId = _location.placeId;
    location = _await(user.location.save());
  }
  if (banner) {
    if (banner === 'undefined') {
      user.banner = '';
    } else {
      user.banner = banner;
    }
  } else if (user.banner) {
    try {
      fs.unlink(`${path.PUBLIC.PROFILE_PICTURES}/${user.banner}`);
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
    }
    user.banner = '';
  }
  if (icon) {
    if (icon === 'undefined') {
      user.icon = '';
    } else {
      user.icon = icon;
    }
  } else if (user.icon) {
    try {
      fs.unlink(`${path.PUBLIC.PROFILE_PICTURES}/${user.icon}`);
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
    }
    user.icon = '';
  }
  user.phone = phone;
  user.mail = mail;

  user = _await(user.save());

  return API.success(res, { user, products });
});
