const save = require('./save');
const view = require('./view');
const del = require('./delete');
const viewByRestaurant = require('./viewByRestaurant');

module.exports = {
  save,
  view,
  delete: del,
  viewByRestaurant
};
