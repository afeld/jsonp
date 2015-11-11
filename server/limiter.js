/*jshint node:true */
var url = require('url');
var epsilonDelta = require('epsilon-delta');

var getUserKey = function(req) {
  // attempt to limit by the application
  var keyUrl = req.headers.referer || req.query.url || req.query.src;
  if (keyUrl) {
    var keyUrlObj = url.parse(keyUrl);
    return keyUrlObj.host;
  } else {
    // otherwise, limit by the IP
    return req.connection.remoteAddress;
  }
};

// use a function so the tests can be stateless
module.exports = function() {
  return epsilonDelta({
    userKey: getUserKey,
    capacity: 100,
    expire: 1000 * 10,
    limitResponse: {
      status: 429,
      body: "You have reached the rate limit for this free service. Please get in touch about sponsorship, or host your own JSONProxy. https://jsonp.afeld.me"
    }
  });
};
