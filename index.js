/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
 const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API

  //const nextISSTimesForMyLocation = require('./iss');

nextISSTimesForMyLocation((err, nextTimes, location) => {
  if (!err) {
    console.log(`For ${location}:`);
    for (let nextTime of nextTimes) {
      let dateTime = new Date(0);
      dateTime.setUTCSeconds(nextTime.risetime);
      console.log(`Next pass at ${dateTime} for ${nextTime.duration} seconds!`);
    }
  } else {
    console.log(err);
  }
});
}

module.exports = { fetchMyIP };
