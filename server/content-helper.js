'use strict';

const JSON3 = require('json3');
const cloudflare = require('./cloudflare');
const omit = require('lodash.omit');

module.exports = {
  isValidJson: function(str) {
    try {
      JSON3.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },

  // convert an object with .entries() to a plain object
  iteratorToObj: iterable => {
    const result = {};
    for (const [key, value] of iterable.entries()) {
      result[key] = value;
    }
    return result;
  },

  passBackHeaders: incomingHeaders => {
    // remove those that node should generate
    const resultHeaders = omit(
      incomingHeaders,
      'connection',
      'content-length',
      'server',
      'x-frame-options'
    );

    return cloudflare.filterHeaders(resultHeaders);
  }
};
