/*jshint node:true */
'use strict';

const base = require('./base');

let patterns = process.env.BLACKLIST || '';
patterns = patterns.split(',');

const isBlacklisted = function(req) {
  let referer = req.get('referer');
  return patterns.some(function(pattern) {
    return referer.includes(pattern);
  });
};

module.exports = function() {
  return function(req, res, next) {
    if (isBlacklisted(req)) {
      res.status(429);
      res.send(base.getMessage());
    } else {
      next();
    }
  };
};
