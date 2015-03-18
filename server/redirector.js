/*jshint node:true */
var url = require('url');

var getRedirectUrl = function(req) {
  var newUrlObj = url.parse(process.env.REDIRECT_ORIGIN);
  newUrlObj.query = req.query;
  return url.format(newUrlObj);
};

module.exports = function(req, res, next) {
  if (process.env.REDIRECT_ORIGIN) {
    var newUrl = getRedirectUrl(req);
    res.redirect(newUrl);
  } else {
    next();
  }
};
