/* jshint node:true */
'use strict';

const requestp = require('./requestp');
const u = require('underscore');
const cloudflare = require('./cloudflare');
const acceptedmethods = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'];


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
  let method = req.method;
  if (!u.contains(acceptedmethods, method)) {
    method = 'GET';
  }
  let externalReqHeaders = passThroughHeaders(req.headers);

  let opts = {
    method: method,
    uri: url,
    strictSSL: false, // node(jitsu?) has some SSL problems
    headers: externalReqHeaders,
    encoding: 'utf8'
  };

  if (opts['headers']['content-length'] !== 0) {
    // extract x-raw-data
    let body = opts['headers']['x-raw-data'];

    // remove x-raw-data
    opts['headers'] = u.omit(opts['headers'], 'x-raw-data');

    // set body
    opts['body'] = body;
  }

  return requestp(opts);
};
