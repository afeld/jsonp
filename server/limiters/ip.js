/*jshint node:true */
var epsilonDelta = require('epsilon-delta');
var baseLimiter = require('./base');

// use a function so the tests can be stateless
module.exports = function(capacity) {
  capacity = capacity || 100;
  var options = {
    userKey: 'connection.remoteAddress',
    capacity: capacity,
    expire: 1000 * 60,
    limitResponse: baseLimiter.getResponse()
  };
  return epsilonDelta(options);
};
