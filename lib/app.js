/*jshint node:true, strict:false */
var express = require('express'),
  url = require('url'),
  request = require('request'),
  u = require('underscore');

var app = express();

app.use(express.logger());
app.use(express['static'](__dirname + '/..'));

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
        raw = params.raw, // undocumented, for now
        status;

      if (error){
        status = 502; // bad gateway
        body = JSON.stringify({
          error: error.message || body
        });

      } else if (!raw && !isValidJson(body)){
        // invalid JSON
        status = 502; // bad gateway
        body = JSON.stringify({ error: body });

      } else {
        // proxy successful
        status = response.statusCode;
        // copy headers from the external response, but remove those that node should generate
        res.set(except(response.headers, 'content-length', 'connection', 'server', 'x-frame-options'));
      }

      // enable cross-domain-ness
      res.set('access-control-allow-origin', '*'); // CORS

      if (!callbackName){
        // treat as an AJAX request (CORS)
        if (raw){
          res.set('content-type', 'text/plain');
        } else {
          res.set('content-type', 'application/json');
        }
      } else {
        // JSONP
        res.set('content-type', 'text/javascript'); // use instead of 'application/javascript' for IE < 8 compatibility

        if (raw){
          // escape and pass as string
          body = '"' + body.replace(/"/g, '\\"') + '"';
        }

        body = callbackName + '(' + body + ');';
      }

      res.send(status, body);
    });
  }
});


module.exports = app;
