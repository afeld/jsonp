/*jshint node:true */
var express = require('express');
var u = require('underscore');
var JSON3 = require('json3');
var snippets = require('./snippets');
var proxy = require('./proxy-request');

var router = express.Router();


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

    var promise = proxy(apiUrl, req.headers, raw);
    promise.then(
      function(response) {
        var responseHeaders = passBackHeaders(response.headers);
        res.set(responseHeaders);

        return {
          status: response.statusCode,
          body: response.body
        };
      },
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
