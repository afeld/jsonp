/*jshint node:true */
'use strict';

exports.getApiUrl = function(req) {
  let query = req.query;
  return query.url || query.src;
};
