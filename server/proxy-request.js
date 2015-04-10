/* jshint node:true */
var requestp = require('./requestp');
var u = require('underscore');
var JSON3 = require('json3');
var cloudflare = require('./cloudflare');


var passThroughHeaders = function(incomingHeaders) {
  // remove those that node should generate
  var externalReqHeaders = u.omit(incomingHeaders,
    'accept-encoding',
    'connection',
    'cookie',
    'host',
    'user-agent'
  );

  externalReqHeaders = cloudflare.filterHeaders(externalReqHeaders);
  externalReqHeaders.accept = 'application/json';
  externalReqHeaders.connection = 'close';

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

  return promise;
};
