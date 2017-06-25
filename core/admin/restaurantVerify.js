const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let restaurant = req.body.restaurant;

  try {
    session = _await(model.AdminSession.findOne({ _id: session }).exec());
    if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

    restaurant = _await(model.Restaurant.findOne({ _id: restaurant }).exec());
    if (!restaurant) return API.fail(res, API.errors.NOT_FOUND);

    restaurant.verified = !restaurant.verified;

    restaurant = _await(restaurant.save());

    const subject = `Your business, ${restaurant.restaurantName} has been successfully verified.`;
    const body = `<p>Hi ${restaurant.restaurantName},</p>
                  <p>Your business, ${restaurant.restaurantName} has been successfully verified.</p>
                  <p>As you get started, you will be publishing your promotions to nearby customers.
                  This will expand your fan/followers base and increase your popularity.
                  You may also find tips in the app when you start creating your coupon(s).</p>
                  <p>For more questions, please do not hesitate to <a href="mailto:enquiry@foodpipr.com">enquiry@foodpipr.com</a> us or you may also read our <a href="http://www.foodpipr.com/faq">FAQ</a> for more information.</p>
                  <br><br>
                  <p>We hope you enjoy using foodpipr.</p>
                  <p>Thank you.</p>
                  <p>Sincerely,</p>
                  <p>Foodpipr Team</p>`;

    utils.sendMessageToUser(restaurant.restaurantMail, subject, body);

    return API.success(res, restaurant);
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
    return API.fail(res, API.errors.UNKNOWN);
  }
});
