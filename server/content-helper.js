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
  }
};
