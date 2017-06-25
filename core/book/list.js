const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  // const user = req.body.user;

  session = _await(model.UserSession.findOne({ _id: session }).populate('user').exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  const books = _await(model.Book.find({ user: session.user }, '_id name user').exec());
  // const books = _await(model.Book.find().exec());

  if (!books.length) return API.fail(res, API.errors.NOT_FOUND);

  return API.success(res, books);
});
