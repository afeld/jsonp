'use strict';

import JSON3 from 'json3';
import * as cloudflare from './cloudflare';
import omit from 'lodash.omit';

export const isValidJson = str => {
  try {
    JSON3.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

// convert an object with .entries() to a plain object
export const iteratorToObj = iterable => {
  const result = {};
  for (const [key, value] of iterable.entries()) {
    result[key] = value;
  }
  return result;
};

export const passBackHeaders = incomingHeaders => {
  // remove those that node should generate
  const resultHeaders = omit(
    incomingHeaders,
    'connection',
    'content-encoding',
    'content-length',
    'server',
    'x-frame-options'
  );

  return cloudflare.filterHeaders(resultHeaders);
};
