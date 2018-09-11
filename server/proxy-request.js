'use strict';

const u = require('underscore');
const cloudflare = require('./cloudflare');

// convert a Headers object to a plain object
const headersToObj = headers => {
  const result = {};
  for (const [key, value] of headers.entries()) {
    result[key] = value;
  }
  return result;
};

let passThroughHeaders = function(incomingHeaders) {
  // remove those that node should generate
  let externalReqHeaders = u.omit(
    incomingHeaders,
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

module.exports = function(url, req) {
  // support GET or HEAD requests
  const method = req.method === 'HEAD' ? 'HEAD' : 'GET';
  const externalReqHeaders = passThroughHeaders(headersToObj(req.headers));

  return fetch(url, {
    method: method,
    headers: externalReqHeaders
  });
};
