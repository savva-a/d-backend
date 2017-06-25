const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let book = req.body.book;

  session = _await(model.UserSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  book = _await(model.Book.findOne({ _id: book })
  .populate({
    model: 'User',
    path: 'user',
  })
  .exec());
  if (!book) return API.fail(res, API.errors.NOT_FOUND);

  if (book.user._id.toString() === session.user.toString()) {
    _await(book.remove());
  }

  return API.success(res, 'book is deleted');
});
