'use strict';

const fetch = require('node-fetch');
const omit = require('lodash.omit');
const cloudflare = require('./cloudflare');
const contentHelper = require('./content-helper');

let passThroughHeaders = function(incomingHeaders) {
  // remove those that node should generate
  let externalReqHeaders = omit(
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
  const externalReqHeaders = passThroughHeaders(
    contentHelper.headersToObj(req.headers)
  );

  return fetch(url, {
    method: method,
    headers: externalReqHeaders
  });
};
