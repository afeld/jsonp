/*jshint node:true */

// JSONP middleware

var url = require('url');
var JSON3 = require('json3');


module.exports = function(req, res, next) {
  // monkey-patch the request
  // TODO make this less of a hack (though it seems to be how others modules are doing it)
  var originalSend = res.send;
  res.send = function(body) {
    var params = url.parse(req.url, true).query;

    var callbackName = params.callback || params.jsonp;
    if (callbackName){
      // JSONP
      res.set('content-type', 'text/javascript'); // use instead of 'application/javascript' for IE < 8 compatibility

      var raw = !!params.raw; // undocumented, for now
      if (raw){
        // escape and pass via JSON
        body = JSON3.stringify({data: body});
      }

      // escape closing tags - see http://stackoverflow.com/a/9249932/358804
      body = body.replace(/<\//g, '<\\/');
      // wrap in callback
      body = callbackName + '(' + body + ');';
    }

    originalSend.call(this, body);
  };

  next();
};
