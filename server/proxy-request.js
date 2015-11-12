/* jshint node:true */
'use strict';

const requestp = require('./requestp');
const u = require('underscore');
const cloudflare = require('./cloudflare');


let passThroughHeaders = function(incomingHeaders) {
  // remove those that node should generate
  let externalReqHeaders = u.omit(incomingHeaders,
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
  let externalReqHeaders = passThroughHeaders(headers);

  return requestp({
    uri: url,
    strictSSL: false, // node(jitsu?) has some SSL problems
    headers: externalReqHeaders,
    encoding: 'utf8'
  });
};
