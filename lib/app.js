/*jshint node:true */
if (process.env.NODE_ENV === 'production' || process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

var express = require('express'),
  morgan = require('morgan'),
  compress = require('compression'),
  cors = require('cors'),
  url = require('url'),
  requestp = require('./requestp'),
  u = require('underscore'),
  JSON3 = require('json3'),
  snippets = require('./snippets');

var app = express();

// logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(compress());
app.use(cors({
  maxAge: 60 * 60 * 24, // one day
  methods: ['GET']
}));
app.use(express['static'](__dirname + '/..'));


function isValidJson(str) {
  try {
    JSON3.parse(str);
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
      host: req.headers.host,
      nodeVersion: process.version,
      snippets: snippets
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
      // process JSON
      function(response){
        var body = response.body;

        if (!raw && !isValidJson(body)){
          // invalid JSON
          throw new Error(body);
        } else {
          // proxy successful

          // copy headers from the external response, but remove those that node should generate
          res.set(u.omit(response.headers, 'content-length', 'connection', 'server', 'x-frame-options'));

          return {
            status: response.statusCode,
            body: body
          };
        }
      }
    ).then(
      null,
      // proxy failure
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
        res.status(result.status);
        var body = result.body;

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

        res.send(body);
      }
    ).done();
  }
});


module.exports = app;
