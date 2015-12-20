/*jshint node:true */
'use strict';

const request = require('request');
const Q = require('q');
const instrument = require('./instrument');


// based on https://coderwall.com/p/9cifuw
module.exports = function(opts) {
  let deferred = Q.defer();
  request(opts, function(err, res, body) {
    instrument.logResponse(res);

    if (err) {
      let message = err.message || body,
        errObj = new Error(message);

      deferred.reject(errObj);
    } else {
      res.body = body;
      deferred.resolve(res);
    }
  });

  return deferred.promise;
};
