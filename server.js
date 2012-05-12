var http = require('http'),
  url = require('url'),
  request = require('request'),
  u = require('underscore');

var apiPort = process.argv[2] || 8000;

function except(obj /*, properties */){
  var result = u.extend({}, obj),
    properties = u.rest(arguments);

  properties.forEach(function(prop){
    delete result[prop];
  });

  return result;
}


http.createServer(function(req, res) {
  var params = url.parse(req.url, true).query,
    apiUrl = params.url || params.src;

  if (!apiUrl){
    res.end('welcome');
  } else {
    var externalReqHeaders = except(req.headers, 'accept-encoding', 'connection', 'cookie', 'host', 'user-agent');
    externalReqHeaders.accept = 'application/json';

    request({
      uri: apiUrl,
      strictSSL: false,
      headers: externalReqHeaders
    }, function(error, response, body){
      // copy headers from the external request, but remove those that node should generate
      var finalHeaders = except(response.headers, 'content-length', 'connection', 'server'),
        callbackName = params.callback || params.jsonp,
        status, json, finalBody;

      finalHeaders['access-control-allow-origin'] = '*'; // allow cross-domain AJAX (CORS)

      if (error){
        status = 502; // bad gateway
        json = JSON.stringify({ error: error.message || body });
      } else {
        status = response.statusCode;
        json = body;
      }

      if (callbackName) {
        finalHeaders['content-type'] = 'text/javascript';
        finalBody = callbackName + '(' + json + ');';
      } else {
        // treat as an AJAX request
        finalHeaders['content-type'] = 'application/json';
        finalBody = json;
      }

      res.writeHead(status, finalHeaders);
      res.end(finalBody);
    });
  }

}).listen(apiPort);

console.log('Server running at http://127.0.0.1:' + apiPort);
