'use strict';

const JSON3 = require('json3');

module.exports = {
  isValidJson: function(str) {
    try {
      JSON3.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },

  // convert a Headers object to a plain object
  headersToObj: headers => {
    const result = {};
    for (const [key, value] of headers.entries()) {
      result[key] = value;
    }
    return result;
  }
};
