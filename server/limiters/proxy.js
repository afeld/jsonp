/*jshint node:true */
var url = require('url');
var epsilonDelta = require('epsilon-delta');
var proxyUtil = require('../proxy_util');
var baseLimiter = require('./base');

var getUserKey = function(req) {
  // attempt to limit by the application
  var keyUrl = req.headers.referer || proxyUtil.getApiUrl(req) || '';
  var keyUrlObj = url.parse(keyUrl);
  return keyUrlObj.host;
};

var getLimiter = function(capacity) {
  capacity = capacity || 100;
  var options = {
    userKey: getUserKey,
    capacity: capacity,
    expire: 1000 * 10,
    limitResponse: baseLimiter.getResponse()
  };
  return epsilonDelta(options);
};

// use a function so the tests can be stateless
module.exports = function(capacity) {
  var limiter = getLimiter(capacity);
  // wrap the limiter middleware
  return function(req, res, next) {
    // only do the limiting if they are making a request via the proxy
    if (getUserKey(req)) {
      limiter(req, res, next);
    } else {
      next();
    }
  };
};
