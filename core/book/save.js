const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');
// const path = require('../path');


module.exports = _async((req, res) => {
  let session = req.body.session;
  let book = req.body.book;
  const text = req.body.text;
  const name = req.body.name;
  const tokens = req.body.tokens;

  session = _await(model.UserSession.findOne({ _id: session }).populate('user').exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  if (!book) {
    if (!text || !name) return API.fail(res, API.errors.MISSED_FIELD);

    book = { name, text, user: session.user._id };

    book = new model.Book(book);

    book = _await(book.save());
    session.user.books.push(book);

    _await(session.user.save());
  } else {
    book = _await(model.Book.findOne({ _id: book }).exec());
    if (!book) return API.fail(res, API.errors.NOT_FOUND);

    utils.assign(book, { name });
    utils.assign(book, { text });
    utils.assign(book, { tokens });

    book = _await(book.save());
  }

  return API.success(res, book);
});
