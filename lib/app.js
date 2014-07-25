/*jshint node:true, strict:false */
if (process.env.NODE_ENV === 'production' || process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

var express = require('express'),
  morgan = require('morgan'),
  compress = require('compression'),
  url = require('url'),
  request = require('request'),
  Q = require('q'),
  u = require('underscore'),
  JSON3 = require('json3');

var app = express();

// logging
app.use(morgan());
app.use(compress());
app.use(express['static'](__dirname + '/..'));


function isValidJson(str) {
  try {
    JSON3.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// based on https://coderwall.com/p/9cifuw
function requestp(opts) {
  var deferred = Q.defer();
  request(opts, function(err, res, body) {
    if (err) {
      err.message = err.message || body;
      deferred.reject(err);
    } else {
      res.body = body;
      deferred.resolve(res);
    }
  });

  return deferred.promise;
}


app.get('/', function(req, res) {
  var params = url.parse(req.url, true).query,
    apiUrl = params.url || params.src;

  if (!apiUrl){
    // serve landing page
    res.render('index.ejs', {
      layout: false,
      host: req.headers.host,
      nodeVersion: process.version
    });

  } else {
    // do proxy
    var raw = !!params.raw; // undocumented, for now

    // copy headers from the external request, but remove those that node should generate
    var externalReqHeaders = u.omit(req.headers, 'accept-encoding', 'connection', 'cookie', 'host', 'user-agent');
    externalReqHeaders.accept = 'application/json';

    requestp({
      uri: apiUrl,
      strictSSL: false, // node(jitsu?) has some SSL problems
      headers: externalReqHeaders,
      encoding: 'utf8'
    }).then(
      function(response){
        var body = response.body,
          status;

        if (!raw && !isValidJson(body)){
          // invalid JSON
          status = 502; // bad gateway
          body = JSON3.stringify({ error: body });
        } else {
          // proxy successful
          status = response.statusCode;
          // copy headers from the external response, but remove those that node should generate
          res.set(u.omit(response.headers, 'content-length', 'connection', 'server', 'x-frame-options'));
        }

        return {
          status: status,
          body: body
        };
      },
      function(error){
        var body = JSON3.stringify({ error: error.message });
        return {
          status: 502, // bad gateway
          body: body
        };
      }
    ).then(
      // respond
      function(result){
        var body = result.body;

        // enable cross-domain-ness
        res.set('access-control-allow-origin', '*'); // CORS

        var callbackName = params.callback || params.jsonp;
        if (callbackName){
          // JSONP
          res.set('content-type', 'text/javascript'); // use instead of 'application/javascript' for IE < 8 compatibility

          if (raw){
            // escape and pass via JSON
            body = JSON3.stringify({data: body});
          }

          // escape closing tags - see http://stackoverflow.com/a/9249932/358804
          body = body.replace(/<\//g, '<\\/');
          // wrap in callback
          body = callbackName + '(' + body + ');';

        } else {
          // treat as an AJAX request (CORS)
          if (raw){
            res.set('content-type', 'text/plain');
          } else {
            res.set('content-type', 'application/json');
          }
        }

        res.send(result.status, body);
      }
    ).done();
  }
});


module.exports = app;
