/*jshint node:true */

// JSONP middleware

var url = require('url');
var JSON3 = require('json3');


var getCallbackName = function(params) {
  return params.callback || params.jsonp;
};

var isJsonP = function(params) {
  return !!getCallbackName(params);
};

var escapeClosingTags = function(str) {
  // http://stackoverflow.com/a/9249932/358804
  return str.replace(/<\//g, '<\\/');
};

var wrapInCallback = function(callbackName, body) {
  return callbackName + '(' + body + ');';
};

var transformJsonPBody = function(params, body) {
  body = escapeClosingTags(body);
  // wrap in callback
  var callbackName = getCallbackName(params);
  return wrapInCallback(callbackName, body);
};

module.exports = function(req, res, next) {
  // monkey-patch the request
  // TODO make this less of a hack (though it seems to be how other modules are doing it)
  var originalSend = res.send;
  res.send = function(body) {
    var params = url.parse(req.url, true).query;

    if (isJsonP(params)){
      res.set('content-type', 'text/javascript'); // use instead of 'application/javascript' for IE < 8 compatibility

      var raw = !!params.raw; // undocumented, for now
      if (raw){
        // escape and pass via JSON
        body = JSON3.stringify({data: body});
      }

      body = transformJsonPBody(params, body);
    }

    originalSend.call(this, body);
  };

  next();
};
