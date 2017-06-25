global.isDebug = true;

let timeStart = new Date();
const isLog = true;

// eslint-disable-next-line no-unused-vars
const colors = require('colors');  // add colors to console

let isRestart = false;

/* eslint-disable no-console*/
/* eslint-disable func-names*/
const consoleError = console.error;
console.error = function (...args) {
  const _arguments = [...args].map((arg) => {
    const res = typeof arg === 'string' ? arg.red : JSON.stringify(arg).red;
    return res;
  });
  consoleError.call(this, ..._arguments);
};

const consoleInfo = console.info;
console.info = function (...args) {
  const _arguments = [...args].map((arg) => {
    const res = typeof arg === 'string' ? arg.blue : arg;
    return res;
  });
  consoleInfo.call(this, ..._arguments);
};

const consoleWarn = console.warn;
console.warn = function (...args) {
  const _arguments = [...args].map((arg) => {
    const res = typeof arg === 'string' ? arg.yellow : arg;
    return res;
  });
  consoleWarn.call(this, ..._arguments);
};

console.ok = function (...args) {
  const _arguments = [...args].map((arg) => {
    const res = typeof arg === 'string' ? arg.cyan : JSON.stringify(arg).cyan;
    return res;
  });
  console.log.call(this, ..._arguments);
};
/* eslint-enable func-names*/

if (isLog) {
  console.log('[DooBee] Start server...');
  console.time('[DooBee] Server ready! Time to up');
}

const express = require('express');
const bodyParser = require('body-parser');
const mongoLib = require('./core/db/init.js');
const mkdirp = require('mkdirp');

const path = require('./core/path');
const model = require('./core/db/model');
const API = require('./core/APILib');
const routes = require('./core/routes');
const utils = require('./core/utils');

const srv = express();

const app = {
  express: srv,
  mongoLib
};

const ServerBootstrap = () => {
  if (isRestart) {
    timeStart = new Date();
  }

  if (isLog) console.log('[DooBee] Init database connection...');

  app.mongoLib.init((err) => {
    if (isLog) {
      console.error('[DooBee] Connect to DB failed: ', err);
      console.info('[DooBee] Trying to reconnect in 5 second... ');
    }
    isRestart = true;
    setTimeout(ServerBootstrap, 5000);
  }, () => {
    if (isLog) console.log('[DooBee] Database connection ready.');

    srv.use(bodyParser.json({ limit: '50mb' }));
    srv.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    if (isLog) console.log('[DooBee] Configure routes...');

    srv.all('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('X-Powered-By', 'zloy.best');
      next();
    });

    srv.all('*', (req, _res, next) => {
      const res = _res;
      API.res = res;
      res.API = API;
      next();
    });

    for (let i = 0; i < Object.keys(path.PUBLIC).length; i += 1) {
      const key = Object.keys(path.PUBLIC)[i];
      if (Object.prototype.hasOwnProperty.call(path.PUBLIC, key)) {
        mkdirp(path.PUBLIC[key], (err) => {
          if (err) console.error(err);
        });
      }
    }

    srv.listen(3001, () => {
      if (isLog) console.ok('[DooBee] Server ready! Time to up:', (new Date()) - timeStart, 'ms');
    }).on('error', (err) => {
      if (isLog) console.error('[DooBee] Error listening port 3001: ', err);
      console.info('[DooBee] Restart in 5 seconds...');
      setTimeout(ServerBootstrap, 5000);
    });

    routes(srv, express);

    if (isLog) {
      console.log('[DooBee] Routes ready.');
      console.log('[DooBee] Start listen port 3001...');
    }

    model.Admin.findOne().then((r) => {
      if (!r) {
        const admin = new model.Admin({
          mail: 'admin',
          password: 'admin'
        });
        admin.save();
        console.info('[DooBee] New admin with credentials "admin", "admin" created! Change password immediately in control panel. ');
      }
    });

    setInterval(() => {
      utils.checkOnExpireDatePromotions();
    }, 1000 * 60); // 1 min

    global.app = app;
  });
};
/* eslint-enable no-console*/
ServerBootstrap();
