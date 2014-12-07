/*jshint node:true */
var express = require('express');
var requestp = require('./requestp');
var u = require('underscore');
var JSON3 = require('json3');
var snippets = require('./snippets');

var router = express.Router();


var passThroughHeaders = function(incomingHeaders) {
  // remove those that node should generate
  var externalReqHeaders = u.omit(incomingHeaders, 'accept-encoding', 'connection', 'cookie', 'host', 'user-agent');
  externalReqHeaders.accept = 'application/json';
  return externalReqHeaders;
};

var isValidJson = function(str) {
  try {
    JSON3.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

var passBackHeaders = function(incomingHeaders) {
  // remove those that node should generate
  return u.omit(incomingHeaders, 'content-length', 'connection', 'server', 'x-frame-options');
};

var errorToJson = function(error) {
  var body = JSON3.stringify({ error: error.message });
  return {
    status: 502, // bad gateway
    body: body
  };
};


router.get('/', function(req, res) {
  var query = req.query;
  var apiUrl = query.url || query.src;

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

    // undocumented, for now
    var raw = !!query.raw;

    var externalReqHeaders = passThroughHeaders(req.headers);

    requestp({
      uri: apiUrl,
      strictSSL: false, // node(jitsu?) has some SSL problems
      headers: externalReqHeaders,
      encoding: 'utf8'
    }).then(
      // process API response
      function(response){
        var body = response.body;

        if (!raw && !isValidJson(body)){
          // invalid JSON
          throw new Error(body);
        } else {
          // proxy successful

          var responseHeaders = passBackHeaders(response.headers);
          res.set(responseHeaders);

          return {
            status: response.statusCode,
            body: body
          };
        }
      }
    ).then(
      null,
      // handle proxy failure
      errorToJson
    ).then(
      // respond
      function(result){
        res.status(result.status);

        if (raw){
          res.set('content-type', 'text/plain');
        } else {
          res.set('content-type', 'application/json');
        }

        res.send(result.body);
      }
    ).done();
  }
});


module.exports = router;
