var http = require('http'),
  url = require('url'),
  request = require('request'),
  u = require('underscore');

var apiPort = process.argv[2] || 8000;

http.createServer(function(req, res) {
  var params = url.parse(req.url, true).query,
    apiUrl = params.url || params.src;

  if (!apiUrl){
    res.end('welcome');
  } else {
    request({
      uri: apiUrl,
      strictSSL: false,
      headers: {
        Accept: 'application/json'
      }
    }, function(error, response, body){
      var status, json;
      if (error){
        status = 502; // bad gateway
        json = JSON.stringify({ error: error.message || body });
      } else {
        status = response.statusCode;
        json = body;
      }

      // copy headers from the external request
      var finalHeaders = u.extend({}, response.headers, {
        'access-control-allow-origin': '*' // allow cross-domain AJAX (CORS)
      });
      // remove headers that node should generate
      delete finalHeaders['content-length'];
      delete finalHeaders.connection;
      delete finalHeaders.server;

      var callbackName = params.callback || params.jsonp,
        finalBody;

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
