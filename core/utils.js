const fs = require('fs');
const https = require('https');
const path = require('./path');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const _async = require('asyncawait/async');
const _await = require('asyncawait/await');
const sharp = require('sharp');
const shell = require('shelljs');

// const API = require('./APILib');
const model = require('./db/model');
const config = require('./config');

const utils = {
  rounding: (value, exp) => {
    function decimalAdjust(type, val, power) {
      // Если степень не определена, либо равна нулю...
      if (typeof power === 'undefined' || +power === 0) {
        return Math[type](val);
      }
      let val_ = +val;
      const power_ = +power;
      // Если значение не является числом, либо степень не является целым числом...
      if (isNaN(val_) || !(typeof power_ === 'number' && power_ % 1 === 0)) {
        return NaN;
      }
      // Сдвиг разрядов
      val_ = val_.toString().split('e');
      val_ = Math[type](+(`${val_[0]}e${(val_[1] ? (+val_[1] - power_) : -power_)}`));
      // Обратный сдвиг
      val_ = val_.toString().split('e');
      return +(`${val_[0]}e${(val_[1] ? (+val_[1] + power_) : power_)}`);
    }

    if (!Math.round10) {
      Math.round10 = (val, power) => decimalAdjust('round', val, power);
    }
    return Math.round10(value, exp);
  },
  generateRandomString: (len) => {
    let length = len;
    if (typeof len === 'undefined') {
      length = 20;
    }
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  },
  generateRandomStringWithLowCase: (len) => {
    let length = len;
    if (typeof len === 'undefined') {
      length = 25;
    }
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  },
  sendMessage: (code, mail, isVerification) => {
    const options = {
      auth: {
        api_key: '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'
      }
    };

    const transporter = nodemailer.createTransport(sgTransport(options));

    const mailOptions = {
      from: '"Foodpipr"no-reply@foodpipr.com', // sender address
      to: mail, // list of receivers
      subject: isVerification ? 'Foodpipr verification' : 'Foodpipr password reset', // Subject line
      html: isVerification ? '<p>Thank you for signing up with Foodpipr.</p>'
            : `<p>This email was sent automatically by Foodpipr in response to your request to reset your password.</p>
<p>Here is your code : <b>${code}</b>.</p>
<p>Please proceed back to the app and follow the instructions to reset your password</p>`
    };

    transporter.sendMail(mailOptions, () => {
    });
  },
  sendMessageToUser: (mail, subject, body) => {
    const options = {
      auth: {
        api_key: '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'
      }
    };

    const transporter = nodemailer.createTransport(sgTransport(options));

    const mailOptions = {
      from: '"Foodpipr"no-reply@foodpipr.com', // sender address
      to: mail, // list of receivers
      subject,
      html: body
    };

    transporter.sendMail(mailOptions, () => {
    });
  },
  sendMessageFromUser: (data, isChefVerification) => {
    const options = {
      auth: {
        api_key: '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'
      }
    };
    const transporter = nodemailer.createTransport(sgTransport(options));
    let mailOptions = {};
    if (isChefVerification) {
      mailOptions = {
        from: data.mail || 'NoUserEmail', // sender address
        to: 'no-reply@foodpipr.com', // list of receivers
        subject: `Request from ${data.name || ''} to be Chef`, // Subject line
        html: `<p>Name : ${data.name || ''}</p>
           <p>NRIC/ID : ${data.NRIC || ''}</p>
           <p>Location : ${data.locationText || ''}</p>
           <p>Mention : ${data.mention || ''}</p>
           <p>Cooking Experience : ${data.cookingExperience || ''}</p>
           <p>Cooking Background : ${data.cookingBackground || ''}</p>
           <p>Professional Qualification : ${data.professionalQualifications || ''}</p>
           <p>Other Qualification : ${data.otherQualifications || ''}</p>`
      };
    } else {
      mailOptions = {
        from: data.mail || 'NoUserEmail', // sender address
        to: 'experience@Foodpipr.sg', // list of receivers
        subject: `Bespoke from ${data.name || ''}`, // Subject line
        html: `<p>Date : ${data.date || ''}</p>
           <p>Location : ${data.location || ''}</p>
           <p>Occasion : ${data.occasion || ''}</p>
           <p>Number of people : ${data.amountOfGroup || ''}</p>
           <p>Budget : ${data.budget.length !== 0 ? '$' : ''}${data.budget || ''}</p>
           <p>Variety : ${data.variety || ''}</p>
           <p>Sweet : ${data.sweet === 'true' ? 'yes' : 'nope'}</p>
           <p>Savoury : ${data.savoury === 'true' ? 'yes' : 'nope'}</p>
           <p>Name : ${data.name || ''}</p>
           <p>Phone : ${data.phone || ''}</p>
           <p>Mail : ${data.mail || ''}</p>
           <p>Special instructions : ${data.specialInstructions || ''}</p>`
      };
    }

    transporter.sendMail(mailOptions, () => {
    });
  },

  validateEmail: (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(`${email}`);
  },

  validateName: name => name.trim() === '',

  isUserFirstTime: (item1, item2, item3, item4) => {
    if (item1 && item2 && item3 && item4 &&
        item1.toString().length && item2.toString().length &&
        item3.toString().length && item4.toString().length) {
      return false;
    }
    return true;
  },

  uploadProfilePicture: _async((photoURL, fileName) => {
  // uploadProfilePicture: _async((photoURL, fileName, userIcon, isNeedRotate) => {
    const file = fs.createWriteStream(`${path.PUBLIC.PROFILE_PICTURES}/${fileName}.jpg`);
    try {
      _await(https.get(photoURL, _async((res) => {
        _await(res.pipe(file));
        // _await(utils.resizeImage(`${path.PUBLIC.PROFILE_PICTURES}/${userIcon}`,
        // 100, `${path.PUBLIC.PROFILE_PICTURES}/${fileName}-thumbnail.jpg`, isNeedRotate));
        // _await(utils.renameImage(`${path.PUBLIC.PROFILE_PICTURES}/${userIcon}`,
        // `${path.PUBLIC.PROFILE_PICTURES}/${fileName}-tmp.jpg`, isNeedRotate));
        // _await(utils.resizeImage(`${path.PUBLIC.PROFILE_PICTURES}/${fileName}-tmp.jpg`, 256,
        // `${path.PUBLIC.PROFILE_PICTURES}/${userIcon}`, isNeedRotate));
      })));
    } catch (e) {
      console.log(`Error: + ${e}`); // eslint-disable-line no-console
    }
  }),

  sendNotification: (text, userId, userName) => {
    const sendNotification = (data) => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${config.APIs.OneSignal.authKey}`
      };

      const options = {
        host: 'onesignal.com',
        port: 443,
        path: '/api/v1/notifications',
        method: 'POST',
        headers
      };

      const req = https.request(options, (res) => {
        res.on('data', (_data) => { // eslint-disable-line no-unused-vars
            // console.log("Response:");
            // console.log(JSON.parse(_data));
        });
      });

      req.on('error', (e) => {
        console.log(`ERROR: \n ${e}`); // eslint-disable-line no-console
      });

      req.write(JSON.stringify(data));
      req.end();
    };

    const filters = [];
    let messageText;

    // if(userId) {
    filters.push({ field: 'tag', key: 'userId', relation: '=', value: userId });
    // }

    if (userName) {
      messageText = `${userName}: ${text}`;
    } else {
      messageText = text;
    }

    const message = {
      app_id: config.APIs.OneSignal.appId,
      contents: { en: messageText },
      filters
    };

    sendNotification(message);
  },

  sendAdminNotification: (text) => {
    const sendNotification = (data) => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${config.APIs.OneSignal.authKey}`
      };

      const options = {
        host: 'onesignal.com',
        port: 443,
        path: '/api/v1/notifications',
        method: 'POST',
        headers
      };

      const req = https.request(options, (res) => {
        res.on('data', (_data) => { // eslint-disable-line no-unused-vars
              // console.log("Response:");
              // console.log(JSON.parse(_data));
        });
      });

      req.on('error', (e) => {
        console.log(`ERROR: \n ${e}`); // eslint-disable-line no-console
      });

      req.write(JSON.stringify(data));
      req.end();
    };

    const message = {
      app_id: config.APIs.OneSignal.appId,
      contents: { en: text },
      included_segments: ['All']
    };

    sendNotification(message);
  },

  promoCodeCheck: () => {
  },

  checkOnExpireDatePromotions: _async(() => {
    const promotions = _await(model.Promotion
      .find({ expiredDate: { $lt: new Date() }, status: 'active' }).exec());
    if (promotions) {
      promotions.forEach((pr) => {
        const promo = pr;
        promo.status = 'expired';
        promo.save();
      });
    }
  }),

  notificationOrder: (order, buyer, chef, product, isChef) => {
    let sender;

    if (!isChef) {
      sender = buyer ? {
        name: buyer.name,
        avatar: buyer.icon,
        isChef: buyer.isChef
      } : null;
    } else {
      sender = chef ? {
        name: chef.name,
        avatar: chef.icon,
        isChef: chef.isChef
      } : null;
    }
    return ({
      sender,
      date: order.orderStatuses[order.orderStatuses.length - 1].date,
      image: product ? product.pictures[0] : null,
      orderCreationDate: order.orderStatuses[0].date,
      customOrderId: order.orderId,
      productName: product ? product.name : null,
      orderStatus: order.orderStatuses[order.orderStatuses.length - 1].value,
      orderId: order._id,
      isBuying: isChef
    });
  },

  userDeleteDialog: _async((dlg, user0, user1, userId) => {
    const dialog = dlg;
    if (`${dialog.user0}` === `${(userId)}`) {
      dialog.isUser0Deleted = true;
      dialog.dateUser0Deleted = Date.now();
    } else if (`${dialog.user1}` === `${userId}`) {
      dialog.isUser1Deleted = true;
      dialog.dateUser1Deleted = Date.now();
    }

    if (dialog.isUser1Deleted && dialog.isUser0Deleted) {
      const messages = _await(model.ChatMessage.find({ dialog: dialog._id }).exec());
      if (!messages || !messages.length) {
        _await(dialog.remove());
      } else {
        messages.forEach((message) => {
          if (message.image) {
            try {
              _await(fs.unlink(`${path.PUBLIC.CHAT_PICTURES}/${message.image}`));
            } catch (e) {
              console.log(e); // eslint-disable-line no-console
            }
          }
          _await(message.remove());
        });
        _await(dialog.remove());
      }
    }

    _await(dialog.save());
  }),

  resizeImage: _async((imageName, size, newFile, isNeedRotate) => {
    try {
      if (isNeedRotate === 'true') {
        _await(sharp(`${imageName}`)
            .resize(size, size)
            .rotate(270)
            .toFile(newFile));
      } else {
        _await(sharp(`${imageName}`)
            .resize(size, size)
            .toFile(newFile));
      }
    } catch (e) {
      return `Error : ${e}`;
    }
    return 'success';
  }),

  resizeImage2: _async((_path, imageName, size) => {
    const imgPath = `${_path}/${imageName}`;
    const imgPathTMP = `${_path}/___${imageName}`;

    const image = _await(sharp(imgPath));
    const metadata = _await(image.metadata());
    if (metadata.width > size || metadata.height > size) {
      if (metadata.width > metadata.height) {
        _await(image.resize(size, null));
      } else {
        _await(image.resize(null, size));
      }
      _await(image.toFile(imgPathTMP));
      _await(fs.unlink(imgPath));
      _await(shell.exec(`mv ${imgPathTMP} ${imgPath}`));
    }
    return image;
  }),

  renameImage: _async((imageName, newName) => {
    try {
      _await(shell.exec(`mv ${imageName} ${newName}`));
    } catch (e) {
      return `Error: ${e}`;
    }
    return 'success';
  }),

  findDialog: _async((userId, interlocutorId) => {
    try {
      let dialog;
      if (userId && interlocutorId) {
        dialog = _await(model.ChatDialog.findOne({
          $or: [{
            user0: userId,
            user1: interlocutorId
          },
          {
            user0: interlocutorId,
            user1: userId
          }]
        }).exec());
      } else if (!interlocutorId) {
        dialog = _await(model.ChatDialog.findOne({
          $or: [{
            user0: userId
          },
          {
            user1: userId
          }]
        }).exec());
      }
      if (!dialog) return false;
      if (`${userId}` === (`${dialog.user0}` && dialog.dateUser0Deleted) || ((`${userId}` === `${dialog.user1}`) && dialog.dateUser1Deleted)) {
        return true;
      }
      return false;
    } catch (e) {
      return `Error: ${e}`;
    }
  }),

  assign: (objectA, objectB) => {
    const key = Object.keys(objectB)[0];
    if (objectB[key]) {
      Object.assign(objectA, objectB);
    }
  }

};

module.exports = utils;
