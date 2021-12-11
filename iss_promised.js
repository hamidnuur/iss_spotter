const request = require('request-promise-native');

const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json');
};
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ip-api.com/json/${ip}`);
};

const issFlyOverTime = function(body) {
  const location = JSON.parse(body);
  return request(`http://api.open-notify.org/iss-pass.json?lat=${location.lat}&lon=${location.lon}&n=5`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(issFlyOverTime)
    .then(body => {
      return JSON.parse(body).response;
    });
};

module.exports = nextISSTimesForMyLocation;