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

  // convert an object with .entries() to a plain object
  iteratorToObj: iterable => {
    const result = {};
    for (const [key, value] of iterable.entries()) {
      result[key] = value;
    }
    return result;
  }
};
