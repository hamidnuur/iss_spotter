const request = require('request');

const fetchMyIp = function(callback) {
  request('https://api.ipify.org?format=json', (err, resp, body) => {
    if (err) {
      callback(`Error: Unable to obtain the IP from ipify.org.\n ${err}.`);
    } else if (resp.statusCode !== 200) {
      callback(`Error: Unable to obtain the IP from ipify.org.\n Status Code: ${resp.statusCode}.\n Response: ${body}`);
    } else {
      const ip = JSON.parse(body).ip;
      if (ip) {
        callback(null, ip);
      } else {
        callback('Error: Could not obtain yout IP address');
      }
    }
  });
};



const fetchCoordsByIP = function(ip, callback) {
  request(`http://ip-api.com/json/${ip}`, (err, resp, body) => {
    if (err) {
      return callback(`Error: Could not obtain GeoLocation from ip-api.com. ${err}`);
    } else if (resp.statusCode !== 200) {
      return callback(`Error: ${resp.statusCode} response code recieved from 'ip-api.com.' ${body}`);
    } else {
      const result = JSON.parse(body);
      if (result.status.toLowerCase() === 'success') {
        return callback(null, {
          latitude: result.lat,
          longitude: result.lon,
          location: `${result.city}, ${result.regionName}, ${result.country}`
        });
      } else {
        return callback(`Error: Failed to obtain geolocation. ${body}`);
      }
    }
  });
};

const issFlyOverTime = function(location, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${location.latitude}&lon=${location.longitude}&n=5`, (err, resp, body) => {
    if (err) {
      return callback(`Error: Could not obtain ISS pass info from open-notify.org. ${err}`);
    } else if (resp.statusCode !== 200) {
      return callback(`Error: ${resp.statusCode} response code recieved from 'open-notify.org' ${body}`);
    } else {
      const result = JSON.parse(body);
      if (result.message.toLowerCase() === 'success' && result.response) {
        return callback(null, result.response);
      } else {
        return callback(`Error: Failed to obtain ISS info. ${body}`);
      }
    }
  });
};


const nextISSTimesForMyLocation = (callback) => {
  fetchMyIp((err, ip) => {
    if (!err) {
      fetchCoordsByIP(ip, (err, coordinates) => {
        if (!err) {
          issFlyOverTime(coordinates, (err, nextTimes) => {
            if (!err) {
              return callback(null, nextTimes, coordinates.location);
            } else {
              return callback(err);
            }
          });
        } else {
          return callback(err);
        }
      });
    } else {
      return callback(err);
    }
  });

};

module.exports = nextISSTimesForMyLocation;