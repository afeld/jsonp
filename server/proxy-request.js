/* jshint node:true */
var requestp = require('./requestp');
var u = require('underscore');
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


module.exports = function(url, headers) {
  var externalReqHeaders = passThroughHeaders(headers);

  return requestp({
    uri: url,
    strictSSL: false, // node(jitsu?) has some SSL problems
    headers: externalReqHeaders,
    encoding: 'utf8'
  });
};
