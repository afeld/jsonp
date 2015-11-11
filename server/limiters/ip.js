/*jshint node:true */
var epsilonDelta = require('epsilon-delta');

// use a function so the tests can be stateless
module.exports = function(capacity) {
  capacity = capacity || 100;
  var options = {
    userKey: 'connection.remoteAddress',
    capacity: capacity,
    expire: 1000 * 10,
    limitResponse: {
      status: 429,
      body: "You have reached the rate limit for this free service. Please get in touch about sponsorship, or host your own JSONProxy. https://jsonp.afeld.me"
    }
  };
  return epsilonDelta(options);
};
