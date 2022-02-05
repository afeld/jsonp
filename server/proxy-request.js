'use strict';

import omit from 'lodash.omit';
import * as cloudflare from './cloudflare';

const passThroughHeaders = (incomingHeaders) => {
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

export default (url, req) => {
  // support GET or HEAD requests
  const method = req.method === 'HEAD' ? 'HEAD' : 'GET';
  const externalReqHeaders = passThroughHeaders(
    Object.fromEntries(req.headers)
  );

  return fetch(url, {
    method: method,
    headers: externalReqHeaders,
  });
};
