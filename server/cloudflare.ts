'use strict';

const omitBy = require('lodash.omitby');

interface Headers {
  // https://github.com/Microsoft/TypeScript/issues/7803#issuecomment-205279410
  [key: string]: string;
}

// remove all CloudFlare headers, since they block requests that are already proxied (through the jsonp.afeld.me)
module.exports.filterHeaders = (headers: Headers) => {
  return omitBy(headers, (_val: string, header: string) => {
    return /^cf-/.test(header);
  });
};
