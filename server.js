var express = require('express'),
  url = require('url'),
  request = require('request'),
  u = require('underscore');

var app = express.createServer(
  express.logger(),
  express.static(__dirname + '/public')
);

app.configure('production', function(){
  var airbrakeKey = process.env.JSONP_AIRBRAKE_KEY;
  if (airbrakeKey){
    var airbrake = require('airbrake').createClient(airbrakeKey);
    airbrake.handleExceptions();
    console.log('Aibrake enabled');
  }
});


function except(obj /*, properties */){
  var result = u.extend({}, obj),
    properties = u.rest(arguments);

  properties.forEach(function(prop){
    delete result[prop];
  });

  return result;
}


app.get('/', function(req, res) {
  var params = url.parse(req.url, true).query,
    apiUrl = params.url || params.src;

  if (!apiUrl){
    res.render('index.ejs', {
      layout: false,
      host: req.headers.host
    });
  } else {
    var externalReqHeaders = except(req.headers, 'accept-encoding', 'connection', 'cookie', 'host', 'user-agent');
    externalReqHeaders.accept = 'application/json';

    request({
      uri: apiUrl,
      strictSSL: false,
      headers: externalReqHeaders
    }, function(error, response, body){
      // copy headers from the external request, but remove those that node should generate
      var callbackName = params.callback || params.jsonp,
        finalHeaders, status;

      if (error){
        status = 502; // bad gateway
        finalHeaders = {};
        body = JSON.stringify({ error: error.message || body });
      } else {
        status = response.statusCode;
        finalHeaders = except(response.headers, 'content-length', 'connection', 'server');
      }

      // enable cross-domain-ness
      delete finalHeaders['x-frame-options'];
      finalHeaders['access-control-allow-origin'] = '*'; // CORS

      if (callbackName) {
        finalHeaders['content-type'] = 'text/javascript';
        body = callbackName + '(' + body + ');';
      } else {
        // treat as an AJAX request
        finalHeaders['content-type'] = 'application/json';
      }

      res.writeHead(status, finalHeaders);
      res.end(body);
    });
  }

});


var apiPort = process.argv[2] || 8000;
app.listen(apiPort);
console.log('Server running at http://127.0.0.1:' + apiPort);
