/*jshint node:true */
'use strict';

const base = require('./base');
const proxyUtil = require('../proxy_util');


let patterns = process.env.BLACKLIST;
patterns = patterns ? patterns.split(',') : [];

const isPatternPresent = function(str) {
  if (str) {
    return patterns.some(function(pattern) {
      return str.includes(pattern);
    });
  } else {
    return false;
  }
};

const isBlacklisted = function(req) {
  let referer = req.get('referer');
  let apiUrl = proxyUtil.getApiUrl(req);
  return isPatternPresent(referer) || isPatternPresent(apiUrl);
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
