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

    restaurant.alreadyVerified = true;

    restaurant = _await(restaurant.save());

    const subject = 'Confirm your registration';
    const body = `<p>Hi ${restaurant.restaurantName},</p>
                  <p>Thank you for creating a merchant account. We need further information from you in order for your account to be approved.</p>
                  <p>Please provide us some information based on the three questions below:</p>
                  <ol>
                    <li>Has your restaurant registered with another web service? For example, Google My Business.</li>
                    <li>Is this the new restaurant that has not yet started to operate?</li>
                    <li>Are you able to provide us the website of the restaurant?</li>
                  </ol>
                  <p>Please kindly reply us via email at enquiry@foodpipr.com and We will get you approved as soon as possible.</p>
                  <br><br>
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
