/*jshint node:true */
var url = require('url');
var epsilonDelta = require('epsilon-delta');

var getUserKey = function(req) {
  var key;

  // attempt to limit by the application
  var keyUrl = req.headers.referer || req.query.url || req.query.src;
  if (keyUrl) {
    var keyUrlObj = url.parse(keyUrl);
    key = keyUrlObj.host;
  } else {
    // otherwise, limit by the IP
    key = req.connection.remoteAddress;
  }

  return key;
};

// use a function so the tests can be stateless
module.exports = function(capacity) {
  capacity = capacity || 100;
  var options = {
    userKey: getUserKey,
    capacity: capacity,
    expire: 1000 * 10,
    limitResponse: {
      status: 429,
      body: "You have reached the rate limit for this free service. Please get in touch about sponsorship, or host your own JSONProxy. https://jsonp.afeld.me"
    }
  };
  var limiter = epsilonDelta(options);
  return limiter;
};
