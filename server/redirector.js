/*jshint node:true */
'use strict';

const url = require('url');


let self = {
  redirectOrigin: function() {
    return process.env.REDIRECT_ORIGIN;
  },

  doRedirect: function() {
    return !!self.redirectOrigin();
  },

  getRedirectUrl: function(req) {
    let newUrlObj = url.parse(self.redirectOrigin());
    newUrlObj.query = req.query;
    return url.format(newUrlObj);
  },

  middleware: function(req, res, next) {
    if (self.doRedirect()) {
      let newUrl = self.getRedirectUrl(req);
      res.redirect(newUrl);
    } else {
      next();
    }
  }
};


module.exports = self;
