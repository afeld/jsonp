/* jshint node:true */
/* global gc */
var requestp = require('./requestp');
var u = require('underscore');
var JSON3 = require('json3');
var util = require('util');


var shouldGarbageCollect = function() {
  console.log('NODE_ENV: ' + process.env.NODE_ENV + '; GC: ' + (typeof gc));
  return process.env.NODE_ENV === 'production' || typeof gc === 'function';
};

var passThroughHeaders = function(incomingHeaders) {
  // remove those that node should generate
  var externalReqHeaders = u.omit(incomingHeaders, 'accept-encoding', 'connection', 'cookie', 'host', 'user-agent');
  externalReqHeaders.accept = 'application/json';
  return externalReqHeaders;
};

var isValidJson = function(str) {
  try {
    JSON3.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};


module.exports = function(url, headers, raw) {
  var externalReqHeaders = passThroughHeaders(headers);

  var promise = requestp({
    uri: url,
    strictSSL: false, // node(jitsu?) has some SSL problems
    headers: externalReqHeaders,
    encoding: 'utf8'
  }).then(
    // process API response
    function(response){
      var body = response.body;

      if (!raw && !isValidJson(body)){
        // invalid JSON
        throw new Error(body);
      } else {
        // proxy successful
        return response;
      }
    }
  );

  if (shouldGarbageCollect()) {
    // https://github.com/afeld/jsonp/issues/18#issuecomment-54732166
    process.nextTick(function() {
      console.log('collecting garbage');
      gc();
      console.log(util.inspect(process.memoryUsage()));
    });
  }

  return promise;
};
