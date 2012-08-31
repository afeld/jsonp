var express = require('express'),
  url = require('url'),
  request = require('request'),
  u = require('underscore');

var app = express.createServer(
  express.logger(),
  express.static(__dirname + '/../public')
);

app.configure('production', function(){
  var airbrakeKey = process.env.JSONP_AIRBRAKE_KEY;
  if (airbrakeKey){
    var airbrake = require('airbrake').createClient(airbrakeKey);
    airbrake.handleExceptions();
    console.log('Aibrake enabled');
  }
});


// returns a copy of the object without the specified properties
function except(obj /*, properties */){
  var result = u.extend({}, obj),
    properties = u.rest(arguments);

  properties.forEach(function(prop){
    delete result[prop];
  });

  return result;
}

function isValidJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}


app.get('/', function(req, res) {
  var params = url.parse(req.url, true).query,
    apiUrl = params.url || params.src;

  if (!apiUrl){
    // serve landing page
    res.render('index.ejs', {
      layout: false,
      host: req.headers.host
    });
  } else {
    // do proxy

    // copy headers from the external request, but remove those that node should generate
    var externalReqHeaders = except(req.headers, 'accept-encoding', 'connection', 'cookie', 'host', 'user-agent');
    externalReqHeaders.accept = 'application/json';

    request({
      uri: apiUrl,
      strictSSL: false, // node(jitsu?) has some SSL problems
      headers: externalReqHeaders
    }, function(error, response, body){
      var callbackName = params.callback || params.jsonp,
        finalHeaders, status;

      if (error || !isValidJson(body)){
        status = 502; // bad gateway
        finalHeaders = {};

        var message = (error && error.message) || body;
        body = JSON.stringify({ error: message });
      } else {
        // proxy successful
        status = response.statusCode;
        // copy headers from the external response, but remove those that node should generate
        finalHeaders = except(response.headers, 'content-length', 'connection', 'server');
      }

      // enable cross-domain-ness
      delete finalHeaders['x-frame-options'];
      finalHeaders['access-control-allow-origin'] = '*'; // CORS

      if (callbackName) {
        // JSONP
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


module.exports = app;
