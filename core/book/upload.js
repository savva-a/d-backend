const _async = require('asyncawait/async');
const _await = require('asyncawait/await');
const textract = require('textract');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  const url = req.body.url;

  let path;
  let name;
  if (req.files && req.files.file) {
    path = req.files.file.path;
    name = req.files.file.originalFilename;
  }
  if (url) {
    path = url;
    name = path;
  }
  if (!path) {
    return API.fail(res, API.errors.MISSED_FIELD);
  }

  session = _await(model.UserSession.findOne({ _id: session }).populate('user').exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  if (url) {
    textract.fromUrl(path, _async((error, text) => {
      let book = { name, text, user: session.user._id };

      book = new model.Book(book);

      book = _await(book.save());

      session.user.books.push(book);
      _await(session.user.save());

      return API.success(res, { success: true, book });
    }));
  } else {
    textract.fromFileWithPath(path, _async((error, text) => {
      let book = { name, text, user: session.user._id };

      book = new model.Book(book);

      book = _await(book.save());

      session.user.books.push(book);
      _await(session.user.save());

      // TODO: del book from public

      return API.success(res, { success: true, book });
    }));
  }
});
