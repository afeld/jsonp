var http = require('http'),
  url = require('url'),
  request = require('request');

var apiPort = process.argv[2] || 8000;

http.createServer(function(req, res) {
  var params = url.parse(req.url, true).query,
    apiUrl = params.url || params.src;

  res.setHeader('Content-Type', 'text/javascript');

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
      var json;
      if (error){
        res.writeHead(502); // bad gateway
        json = JSON.stringify({ error: error.message || body });
      } else {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*' // allow cross-domain AJAX (CORS)
        });

        json = body;
      }

      var callbackName = params.callback || params.jsonp;
      if (callbackName) {
        res.end(callbackName + '(' + json + ');');
      } else {
        // treat as an AJAX request
        res.end(json);
      }
    });
  }

}).listen(apiPort);

console.log('Server running at http://127.0.0.1:' + apiPort);
