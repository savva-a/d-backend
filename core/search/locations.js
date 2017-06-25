const fetch = require('node-fetch');

const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

const APIKEY = 'AIzaSyDdLOwgSQoK6oG9Dm_LYCzXkx-zlPXt1DE';

module.exports = _async((req, res) => {
  const lat = req.body.lat ? Number(req.body.lat) : null;
  const long = req.body.long ? Number(req.body.long) : null;
  let findedRestaurant = [];

  // const radius = 0.22616772; // 25km:
  // const radius = 0.18018018018; // 20km:
  // const DIST = 25000; // 20km
  // const radius = 0.0900900901; // 10km:
  // const DIST = 10000; // 10km
  const radius = 0.02702702702; // 3km:
  const DIST = 3000; // 3 km

  if (!lat || !long) return API.fail(res, API.errors.COORDINATES_NOT_FOUND);

  const restaurants = _await(model.Restaurant.find({
    verified: true,
    'coordinate.latitude': { $gte: `${lat - radius}`, $lt: `${lat + radius}` },
    'coordinate.longitude': { $gte: `${long - radius}`, $lt: `${long + radius}` }
  }).populate({
    path: 'promotions',
    options: {
      sort: { expiredDate: 1 }
    },
    match: {
      status: 'active',
    }
  }).lean().exec());

  const getDist = (url) => {
    const result = fetch(url).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }
      return Promise.reject(new Error(response.statusText));
    })
    .then(response => response.json());
    return result;
  };

  if (restaurants) {
    let coordinatesTo = '';
    restaurants.forEach((restaurant) => {
      coordinatesTo += `${restaurant.coordinate.latitude},${restaurant.coordinate.longitude}|`;
    });
    const coordinateFrom = `${lat},${long}`;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${coordinateFrom}&destinations=${coordinatesTo}&mode=walking&language=en-US&key=${APIKEY}`;
    const distantions = _await(getDist(url));
    restaurants.forEach((_restaurant, idx) => {
      const restaurant = _restaurant;
      if (distantions.status === 'OK' && distantions.rows[0].elements[idx].status === 'OK') {
        restaurant.distance = distantions.rows[0].elements[idx].distance;
        restaurant.duration = distantions.rows[0].elements[idx].duration;

        if (distantions.rows[0].elements[idx].distance.value <= DIST) {
          findedRestaurant.push(restaurant);
        }
      } else if (distantions.rows[0].elements[idx].status === 'ZERO_RESULTS') {
        restaurant.distance = { text: '0 m', value: 0 };
        restaurant.duration = { text: '0 mins', value: 0 };
        findedRestaurant.push(restaurant);
      }
    });
  }

  function compare(a, b) {
    if (a.distance.value < b.distance.value) {
      return -1;
    }
    if (a.distance.value > b.distance.value) {
      return 1;
    }
    return 0;
  }

  findedRestaurant.sort(compare);

  const idList = findedRestaurant.map(item => item._id);
  const farRestaurants = _await(model.Restaurant.find({
    verified: true,
    _id: { $nin: idList }
  }).populate({
    path: 'promotions',
    options: {
      sort: { expiredDate: 1 }
    },
    match: {
      status: 'active',
    }
  }).lean().exec());

  findedRestaurant = findedRestaurant.concat(farRestaurants);

  return API.success(res, findedRestaurant);
});
