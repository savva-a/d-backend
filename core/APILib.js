const fetch = require('node-fetch');

const API = {};
API.res = null;

const STATUS_FAIL = 'fail';
const STATUS_SUCCESS = 'success';

const errors = {
  UNKNOWN: {
    code: 1,
    text: 'Unknown error'
  },

  REVIEW_EXIST: {
    code: 100,
    text: 'Review exist'
  },
  USER_EXIST: {
    code: 100,
    text: 'User exist'
  },
  EMAIL_EXIST: {
    code: 100,
    text: 'Email exist'
  },
  PHONE_NUMBER_EXIST: {
    code: 100,
    text: 'Phone number exist'
  },

  PROMO_CODE_EXIST: {
    code: 100,
    text: 'Promo code exist'
  },

  MISSED_FIELD: {
    code: 101,
    text: 'Some fields missing'
  },

  USER_PASSWORD_NOT_MATCH: {
    code: 103,
    text: 'User password not match'
  },

  USER_CODE_NOT_MATCH: {
    code: 103,
    text: 'Code not match'
  },

  INVALID_EMAIL_ADDRESS: {
    code: 400,
    text: 'Invalid E-mail address'
  },
  INVALID_NAME: {
    code: 400,
    text: 'Invalid username'
  },
  INVALID_RATING: {
    code: 400,
    text: 'Invalid rating'
  },

  INVALID_PHONE_NUMBER: {
    code: 400,
    text: 'Invalid phone number'
  },

  INVALID_PRICE: {
    code: 400,
    text: 'Invalid price value'
  },

  INVALID_PROMO_CODE: {
    code: 400,
    text: 'Invalid promo code'
  },

  INVALID_CATEGORY: {
    code: 400,
    text: 'Invalid category'
  },

  INVALID_REDEEM_CODE: {
    code: 404,
    text: 'Incorrect Redeem Code. Try again.'
  },

  REDEEM_LIMIT: {
    code: 400,
    text: 'Redeem limit reached'
  },

  UNAUTHORIZED: {
    code: 401,
    text: 'Unauthorized'
  },

  ACCESS_DENIED: {
    code: 403,
    text: 'Access denied'
  },

  ORDER_NOT_CONFIRMED: {
    code: 403,
    text: 'Order not confirmed'
  },

  NOT_FOUND: {
    code: 404,
    text: 'Not found'
  },

  USER_NOT_FOUND: {
    code: 404,
    text: 'User not found'
  },

  CHEF_NOT_FOUND: {
    code: 404,
    text: 'Chef not found'
  },

  BUYER_NOT_FOUND: {
    code: 404,
    text: 'Buyer not found'
  },

  PROMO_CODE_NOT_FOUND: {
    code: 404,
    text: 'Promo code not found'
  },

  PRODUCT_NOT_FOUND: {
    code: 404,
    text: 'Product not found'
  },

  PROMOTION_NOT_FOUND: {
    code: 404,
    text: 'Promotion not found'
  },

  COORDINATES_NOT_FOUND: {
    code: 404,
    text: 'Coordinates not found'
  },

  DATE_EXPIRED: {
    code: 409,
    text: 'Expiry date is ended'
  },

  ORDER_ALREADY_CANCELED: {
    code: 410,
    text: 'Order already canceled'
  }

};

API.errors = errors;

API.responce = (_status, _code, _data) => {
  let status = _status;
  let code = _code;
  let data = _data;
    // simple form API.response(data)
  if (typeof code === 'undefined' && typeof data === 'undefined') {
    data = status;
    code = 0;
    status = STATUS_SUCCESS;
  }

  status = typeof status === 'undefined' ? STATUS_SUCCESS : status;
  code = typeof code === 'undefined' ? 0 : code;
  data = typeof data === 'undefined' ? {} : data;

  return {
    status,
    code,
    data
  };
};

API.success = (_res, _data) => {
  let res = _res;
  let data = _data;
  if (!res && !API.res) throw new Error('You should pass an response object as first parameter because it does not set in your router');
  if (!data) {
    data = res;
    res = API.res;
  }
  if (!res || !res.json) throw new Error('Response should be a valid express response object');
  return res.json(API.responce(data));
};

API.fail = (_res, _error) => {
  let res = _res;
  let error = _error;
  if (!res && !API.res) throw new Error('You should pass an response object as first parameter because it does not set in your router');
  if (!error) {
    error = res;
    res = API.res;
  }
  if (!res || !res.json) throw new Error('Response should be a valid express response object');
  return res.json(API.error(error));
};

API.error = (_errorMsg, _errorCode) => {
  let errorMsg = _errorMsg;
  let errorCode = _errorCode;
  errorMsg = typeof errorMsg === 'undefined' ? '' : errorMsg;
  errorCode = typeof errorCode === 'undefined' ? 0 : errorCode;

  if (typeof errorMsg === 'object') {
    errorCode = errorMsg.code;
    errorMsg = errorMsg.text;
  }

  return API.responce(STATUS_FAIL, errorCode, { msg: errorMsg });
};


API.emailSubscribe = (email) => {
  const url = 'https://us13.api.mailchimp.com/3.0/lists/c349d0f029/members';
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic YW55c3RyaW5nOjZiMDJhNjEwNjkyNjUxYWNiMTFhMDBlN2QwYjJmYzdlLXVzMTM'
    },
    body: `{"email_address":"${email}","status":"subscribed"}`
  })
  .then(r => r.json()).catch(e => console.log(e)); // eslint-disable-line no-console
};

API.getGoogleAuth = (url) => {
  const res = fetch(url).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
  })
  .then(response => response.json());
  return res;
};

module.exports = API;
