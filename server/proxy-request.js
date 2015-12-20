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
    'host'
  );

  externalReqHeaders = cloudflare.filterHeaders(externalReqHeaders);
  externalReqHeaders.accept = 'application/json';
  externalReqHeaders.connection = 'close';

  return externalReqHeaders;
};


module.exports = function(url, req) {
  // support GET or HEAD requests
  let method = req.method === 'HEAD' ? 'HEAD' : 'GET';
  let externalReqHeaders = passThroughHeaders(req.headers);

  return requestp({
    method: method,
    uri: url,
    strictSSL: false, // node(jitsu?) has some SSL problems
    headers: externalReqHeaders,
    encoding: 'utf8'
  });
};
