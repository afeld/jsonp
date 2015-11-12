/* jshint node:true */
'use strict';

const u = require('underscore');


// remove all CloudFlare headers, since they block requests that are already proxied (through the jsonp.afeld.me)
module.exports.filterHeaders = function(headers) {
  return u.omit(headers, function(val, header) {
    return /^cf-/.test(header);
  });
};
