const signIn = require('./signIn');
const logout = require('./logout');
const usersList = require('./usersList');
const sessionCheck = require('./sessionCheck');
const userProfile = require('./userProfile');
const userBan = require('./userBan');
const userSearch = require('./userSearch');
const restaurantsList = require('./restaurantsList');
const restaurantProfile = require('./restaurantProfile');
const restaurantVerify = require('./restaurantVerify');
const restaurantReject = require('./restaurantReject');
const restaurantSpam = require('./restaurantSpam');
// const productsList = require('./productsList');
// const productSearch = require('./productSearch');
// const product = require('./product');
// const productDelete = require('./productDelete');
// const productSave = require('./productSave');
// const feedbacks = require('./feed');
// const feedbackRemove = require('./feedbackRemove');
const userProfileSave = require('./userProfileSave');
const userProfileDelete = require('./userProfileDelete');
const userSwitch = require('./userSwitch');
const userDecline = require('./userDecline');
const userDeclineSpam = require('./userDeclineSpam');
// const userUpdate = require('./userUpdate');
const registration = require('./registration');
const list = require('./list');
const del = require('./delete');
// const notificationAdd = require('./notificationAdd');
// const notificationsList = require('./notificationsList');
// const ordersList = require('./ordersList');
// const orderCancel = require('./orderCancel');
// const promoCodesList = require('./promoCodesList');
// const promoCodeGenerate = require('./promoCodeGenerate');
// const promoCodeCreate = require('./promoCodeCreate');
// const promoCodeStatusChange = require('./promoCodeStatusChange');

module.exports = {
  signIn,
  logout,
  sessionCheck,
  registration,
  list,
  delete: del,

  usersList,
  userProfile,
  userBan,
  userSearch,
  userProfileSave,
  userProfileDelete,
  userSwitch,
  userDecline,
  userDeclineSpam,

  restaurantsList,
  restaurantProfile,
  restaurantVerify,
  restaurantReject,
  restaurantSpam,
  // productsList,
  // productSearch,
  // product,
  // productDelete,
  // productSave,
  // feedbacks,
  // feedbackRemove,

  // userUpdate,

  // notificationAdd,
  // notificationsList,
  // ordersList,
  // orderCancel,
  // promoCodesList,
  // promoCodeGenerate,
  // promoCodeCreate,
  // promoCodeStatusChange,
};
