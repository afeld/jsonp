/*jshint node:true */
'use strict';

const epsilonDelta = require('epsilon-delta');
const baseLimiter = require('./base');

// use a function so the tests can be stateless
module.exports = function(capacity) {
  capacity = capacity || 100;
  let options = {
    userKey: 'connection.remoteAddress',
    capacity: capacity,
    expire: 1000 * 60,
    limitResponse: baseLimiter.getResponse()
  };
  return epsilonDelta(options);
};
