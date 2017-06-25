const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');
const path = require('../path');


module.exports = _async((req, res) => {
  let restaurant = req.body.restaurant;
  let session = req.body.session;
  const restaurantName = req.body.restaurantName;
  const description = req.body.description;
  const website = req.body.website;
  const country = req.body.country;
  const restaurantMail = req.body.restaurantMail;
  const businessRegNum = req.body.businessRegNum;
  const type = req.body.type;
  const postalCode = req.body.postalCode;
  const address = req.body.address;
  const optHours = req.body.optHours;
  const unitNumber = req.body.unitNumber;
  const coordinate = req.body.coordinate ? JSON.parse(req.body.coordinate) : null;
  const phone = req.body.phone;
  const followers = req.body.followers ? JSON.parse(req.body.followers) : null;
  const promotions = req.body.promotions ? JSON.parse(req.body.promotions) : null;
  let logo;

  session = _await(model.UserSession.findOne({ _id: session }).populate('user').exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  // if (!session.user.isRestaurant) return API.fail(res, API.errors.ACCESS_DENIED);

  if (req.files && req.files.file) {
    const arr = req.files.file.path.split('/');
    logo = arr[arr.length - 1];
  }

  if (!restaurant) {
    if (!restaurantName ||
        !phone ||
        !businessRegNum ||
        !type ||
        !postalCode ||
        !address ||
        !unitNumber ||
        !coordinate
      ) return API.fail(res, API.errors.MISSED_FIELD);

    restaurant = {
      restaurantName,
      phone,
      businessRegNum,
      type,
      postalCode,
      address,
      unitNumber,
      coordinate
    };
    utils.assign(restaurant, { logo });

    restaurant = new model.Restaurant(restaurant);

    restaurant = _await(restaurant.save());
    session.user.restaurants.push(restaurant);

    _await(session.user.save());
  } else {
    restaurant = _await(model.Restaurant.findOne({ _id: restaurant }).exec());
    if (!restaurant) return API.fail(res, API.errors.NOT_FOUND);

    if (restaurantMail) {
      const emailIsValid = utils.validateEmail(restaurantMail);
      if (!emailIsValid) return API.fail(res, API.errors.INVALID_EMAIL_ADDRESS);
    }

    utils.assign(restaurant, { restaurantName });
    utils.assign(restaurant, { description });
    utils.assign(restaurant, { website });
    utils.assign(restaurant, { country });
    utils.assign(restaurant, { logo });
    utils.assign(restaurant, { phone });
    utils.assign(restaurant, { optHours });
    utils.assign(restaurant, { address });
    utils.assign(restaurant, { postalCode });
    utils.assign(restaurant, { unitNumber });
    utils.assign(restaurant, { coordinate });
    utils.assign(restaurant, { restaurantMail });
    utils.assign(restaurant, { followers });
    utils.assign(restaurant, { promotions });
    restaurant = _await(restaurant.save());
  }

  if (restaurant.logo) {
    const pic = restaurant.logo;
    _await(utils.resizeImage2(path.PUBLIC.RESTAURANT_PICTURES, pic, 1920));
  }

  return API.success(res, restaurant);
});
