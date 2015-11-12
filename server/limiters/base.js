/*jshint node:true */
'use strict';

exports.getResponse = function() {
  return {
    status: 429,
    body: "You have reached the rate limit for this free service. Please get in touch about sponsorship, or host your own JSONProxy. https://jsonp.afeld.me"
  };
};
