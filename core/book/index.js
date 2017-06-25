const list = require('./list');
const save = require('./save');
const view = require('./view');
const del = require('./delete');
const upload = require('./upload');

module.exports = {
  list,
  save,
  delete: del,
  view,
  upload
};
