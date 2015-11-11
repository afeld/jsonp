/*jshint node:true */

exports.getApiUrl = function(req) {
  var query = req.query;
  return query.url || query.src;
};
