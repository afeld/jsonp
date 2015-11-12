/*jshint node:true */
'use strict';

const url = require('url');
const epsilonDelta = require('epsilon-delta');
const proxyUtil = require('../proxy_util');
const baseLimiter = require('./base');

let getUserKey = function(req) {
  // attempt to limit by the application
  let keyUrl = req.headers.referer || proxyUtil.getApiUrl(req) || '';
  let keyUrlObj = url.parse(keyUrl);
  return keyUrlObj.host;
};

let getLimiter = function(capacity) {
  capacity = capacity || 100;
  let options = baseLimiter.getOptions();
  Object.assign(options, {
    userKey: getUserKey,
    capacity: capacity,
    expire: 1000 * 10
  });
  return epsilonDelta(options);
};

// use a function so the tests can be stateless
module.exports = function(capacity) {
  let limiter = getLimiter(capacity);
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
