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
  // support GET or HEAD or POST requests
  let methods = ['GET', 'HEAD', 'POST'];
  let method  = null;
  if (methods.indexOf(req.method) > -1) {
    method = req.method;
  } else {
    method = 'GET';
  }
  let externalReqHeaders = passThroughHeaders(req.headers);

  if (method == 'POST') {
    if (typeof(req.headers['x-post-data']) !== undefined && req.headers['x-post-data']) {
      // extract x-post-data
      let postdata = externalReqHeaders['x-post-data'];

      // remove x-post-data
      externalReqHeaders = u.omit(externalReqHeaders, 'x-post-data');

      return requestp({
        method: method,
        uri: url,
        strictSSL: false, // node(jitsu?) has some SSL problems
        headers: externalReqHeaders,
        body: postdata,
        encoding: 'utf8'
      });
    }
  }

  return requestp({
    method: method,
    uri: url,
    strictSSL: false, // node(jitsu?) has some SSL problems
    headers: externalReqHeaders,
    encoding: 'utf8'
  });
};
