/*jshint node:true */
var url = require('url');


var self = {
  redirectOrigin: function() {
    return process.env.REDIRECT_ORIGIN;
  },

  doRedirect: function() {
    return !!self.redirectOrigin();
  },

  getRedirectUrl: function(req) {
    var newUrlObj = url.parse(self.redirectOrigin());
    newUrlObj.query = req.query;
    return url.format(newUrlObj);
  },

  middleware: function(req, res, next) {
    if (self.doRedirect()) {
      var newUrl = self.getRedirectUrl(req);
      res.redirect(newUrl);
    } else {
      next();
    }
  }
};


module.exports = self;
