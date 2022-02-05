'use strict';

import omit from 'lodash.omit';
import * as cloudflare from './cloudflare';
import * as contentHelper from './content-helper';

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
    contentHelper.iteratorToObj(req.headers)
  );

  return fetch(url, {
    method: method,
    headers: externalReqHeaders,
  });
};
