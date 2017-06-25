const mongoose = require('mongoose');

const mongoLib = {
  connection: null,
  connected: false,
  init: null,
  isConnected: null
};

const MongooseInit = (errCb, sucCb) => {
  let onError = errCb;
  let onSuccess = sucCb;
  if (typeof onSuccess === 'undefined') {
    onSuccess = onError;
    onError = undefined;
  }
  mongoose.Promise = global.Promise;

  mongoLib.connection = mongoose.connection;

  mongoLib.connection.close();

  mongoLib.connection.on('error', () => {
    console.log(arguments); // eslint-disable-line no-console
  });

  mongoLib.connection.once('open', () => {
    mongoLib.connected = true;
  });

  const DBHost = 'localhost';
  const DBName = 'doobee';
  const DBUserName = 'doobee-user';
  // const DBPassword = 'doobee';
  const DBPassword = '5oob33pa$$w0rd';
  const connectURL = `mongodb://${DBUserName}:${DBPassword}@${DBHost}:27017/${DBName}`;
  // const connectURL = `mongodb://${DBHost}:27017/${DBName}`;

  mongoose.connect(connectURL, (err) => {
    if (err) {
      if (typeof onError === 'function') {
        onError(err);
      }
      mongoLib.connection.close();
      // return null;
    }
    if (typeof onSuccess === 'function') {
      onSuccess.call();
    }
  });
};

mongoLib.init = MongooseInit;

const isConnected = () => {
  if (!mongoLib.connected) {
    console.error('Error! No MongoDB connection.'); // eslint-disable-line no-console
    return false;
  }

  return true;
};

mongoLib.isConnected = isConnected;

module.exports = mongoLib;
