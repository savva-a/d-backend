const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let restaurant = req.body.restaurant;


  session = _await(model.UserSession.findOne({ _id: session }).populate({
    model: 'User',
    path: 'user'
  }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  restaurant = _await(model.Restaurant.findOne({ _id: restaurant }).exec());
  if (!restaurant) return API.fail(res, API.errors.NOT_FOUND);

  const idx = session.user.following.indexOf(req.body.restaurant);
  if (idx === -1) {
    session.user.following.push(restaurant);
    restaurant.followers.push(session.user);
  } else {
    session.user.following.splice(idx, 1);
    restaurant.followers.splice(restaurant.followers.indexOf(session.user._id), 1);
  }
  const user = _await(session.user.save());
  _await(restaurant.save());
  return API.success(res, user);
});
