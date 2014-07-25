/*jshint node:true */
var request = require('request'),
  Q = require('q');

// based on https://coderwall.com/p/9cifuw
module.exports = function(opts) {
  var deferred = Q.defer();
  request(opts, function(err, res, body) {
    if (err) {
      var message = err.message || body;
      deferred.reject(message);
    } else {
      res.body = body;
      deferred.resolve(res);
    }
  });

  return deferred.promise;
};
