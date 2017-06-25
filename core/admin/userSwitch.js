const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
// const utils = require('../utils');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let user = req.body.user;

  try {
    session = _await(model.AdminSession.findOne({ _id: session }).exec());
    if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

    user = _await(model.User.findOne({ _id: user }).exec());
    if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);
    user.isRestaurant = !user.isRestaurant;

    user.isSubmitApplicationForRestaurant = false;

    user = _await(user.save());
    // don't send email...
    // if (user.isRestaurant) {
    //   const subject = 'Account was switched to merchant';
    //   const body = `<p>Hi ${user.name},</p>
    //   <p>Your business, ${user.name} has been successfully verified.</p>
    //   <p>As you get started, you may start to publish your promotions to nearby customers .
    //   This will expand your fan/followers base and increase your popularity.
    //   You may also look for the tips in the app when you start to create your coupon(s).</p>
    //   <p>For more questions, please do not hesitate to email us or
    //   you may also read our FAQ for more information.</p>
    //   <p>We hope you enjoy using Foodpipr.</p>
    //   Thank you.
    //   <br>
    //   Sincerely,
    //   <br>
    //   Foodpipr Team`;
    //
    //   utils.sendMessageToUser(user.mail, subject, body);
    // }
    return API.success(res, { user, products: [] });
  } catch (e) {
    return API.fail(res, API.errors.UNKNOWN);
  }
});
