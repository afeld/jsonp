'use strict';

import omit from 'lodash.omit';
import { filterHeaders, SimpleHeaders } from './cloudflare';

const passThroughHeaders = (incomingHeaders: SimpleHeaders) => {
  // remove those that node should generate
  let externalReqHeaders = omit(
    incomingHeaders,
    'accept-encoding',
    'connection',
    'cookie',
    'host',
    'user-agent'
  );

  externalReqHeaders = filterHeaders(externalReqHeaders);
  externalReqHeaders.accept = 'application/json';
  externalReqHeaders.connection = 'close';

  return externalReqHeaders;
};

export default (url: string, req: Request) => {
  // support GET or HEAD requests
  const method = req.method === 'HEAD' ? 'HEAD' : 'GET';
  const initialHeaders = Object.fromEntries(req.headers);
  const externalReqHeaders = passThroughHeaders(initialHeaders);

  return fetch(url, {
    method: method,
    headers: externalReqHeaders,
  });
};
