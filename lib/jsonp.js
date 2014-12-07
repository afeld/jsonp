/*jshint node:true */

// JSONP middleware


var typer = require('media-typer');
var url = require('url');
var JSON3 = require('json3');


var getMediaTypeType = function(res) {
  var mediaType = res.get('content-type');
  return typer.parse(mediaType).type;
};

var isTextResponse = function(res) {
  var type = getMediaTypeType(res);
  return type === 'text';
};

var getCallbackName = function(params) {
  return params.callback || params.jsonp;
};

var isJsonP = function(params) {
  // TODO check media type?
  return !!getCallbackName(params);
};

var escapeClosingTags = function(str) {
  // http://stackoverflow.com/a/9249932/358804
  return str.replace(/<\//g, '<\\/');
};

var wrapInCallback = function(callbackName, body) {
  return callbackName + '(' + body + ');';
};

var transformJsonPBody = function(params, body, res) {
  if (isTextResponse(res)) {
    // escape and pass via JSON
    body = JSON3.stringify({data: body});
  }

  body = escapeClosingTags(body);

  var callbackName = getCallbackName(params);
  body = wrapInCallback(callbackName, body);

  return body;
};


module.exports = function(req, res, next) {
  /*
    Monkey-patch the response. It would be great to make this less of a hack, though it seems to be how other modules are doing it (as of 12/6/14):
    * https://github.com/nemtsov/express-partial-response/blob/cf9a426/index.js#L30-L31
    * https://github.com/expressjs/compression/blob/c45fae3/index.js#L85-L133
    * https://github.com/jshttp/on-headers/blob/cc3688b/index.js#L30
    * http://stackoverflow.com/a/15103881/358804
  */
  var originalSend = res.send;
  res.send = function(body) {
    var params = url.parse(req.url, true).query;

    if (isJsonP(params)){
      body = transformJsonPBody(params, body, res);
      res.set('content-type', 'text/javascript'); // use instead of 'application/javascript' for IE < 8 compatibility
    }

    originalSend.call(this, body);
  };

  next();
};
