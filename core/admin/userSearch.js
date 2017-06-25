const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  const text = req.body.text;
  const findedChefs = [];
  const findedBuyers = [];

  session = _await(model.AdminSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  const users = _await(model.User.find().populate('location').sort({ _id: -1 }).exec());

  if (users) {
    users.forEach((user) => {
      let indexName = -1;
      let indexMail = -1;
      let indexLocation = -1;
      if (user.name) indexName = user.name.toLowerCase().indexOf(text.toLowerCase());
      if (user.mail) indexMail = user.mail.toLowerCase().indexOf(text.toLowerCase());
      if (user.location && user.location.text) {
        indexLocation = user.location.text.toLowerCase().indexOf(text.toLowerCase());
      }
      if (indexName !== -1 || indexMail !== -1 || indexLocation !== -1) {
        // if (user.isChef) {
        if (user.isRestaurant) {
          findedChefs.push(user);
        } else {
          findedBuyers.push(user);
        }
      }
    });
  }

  if (!findedBuyers.length && !findedChefs.length) return API.fail(res, API.errors.NOT_FOUND);
  return API.success(res, { findedChefs, findedBuyers });
});
