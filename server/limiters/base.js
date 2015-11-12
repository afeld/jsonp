/*jshint node:true */
'use strict';

let redisUrl = process.env.REDIS_URL;
let redisClient;
if (redisUrl) {
  console.log("Using Redis for rate limiting.");
  redisClient = require('redis').createClient(redisUrl);
} else {
  console.log("REDIS_URL not set – using in-memory datastore for rate limiting.");
}

exports.getOptions = function() {
  let opts = {
    limitResponse: {
      status: 429,
      body: "You have reached the rate limit for this free service. Please get in touch about sponsorship, or host your own JSONProxy. https://jsonp.afeld.me"
    }
  };

  if (redisClient) {
    opts.db = redisClient;
  }

  return opts;
};
