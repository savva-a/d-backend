const path = require('path');

const BASE_PATH = path.dirname(process.mainModule.filename);
module.exports = {
  PUBLIC: {
    BOOKS: `${BASE_PATH}/public/books`,
    PROFILE_PICTURES: `${BASE_PATH}/public/profile_pictures`,
    PRODUCT_PICTURES: `${BASE_PATH}/public/product_pictures`,
    PROMOTION_PICTURES: `${BASE_PATH}/public/promotion_pictures`,
    RESTAURANT_PICTURES: `${BASE_PATH}/public/restaurant_pictures`,
    API_DOC: `${BASE_PATH}`,
    CHAT_PICTURES: `${BASE_PATH}/public/chat_pictures`,
    TEST: `${BASE_PATH}/public/test`
  }
};
