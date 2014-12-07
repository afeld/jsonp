/*jshint node:true */
var express = require('express');
var u = require('underscore');
var JSON3 = require('json3');
var snippets = require('./snippets');
var proxy = require('./proxy-request');

var router = express.Router();


var serveLandingPage = function(req, res) {
  res.render('index.ejs', {
    layout: false,
    host: req.headers.host,
    nodeVersion: process.version,
    snippets: snippets
  });
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

var respond = function(res, raw, result) {
  res.status(result.status);

  if (raw){
    res.set('content-type', 'text/plain');
  } else {
    res.set('content-type', 'application/json');
  }

  res.send(result.body);
};


router.get('/', function(req, res) {
  var query = req.query;
  var apiUrl = query.url || query.src;

  if (!apiUrl){
    // serve landing page
    serveLandingPage(req, res);
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
      }
    ).fail(
      // keep this right before respond() to handle errors from any previous steps
      errorToJson
    ).then(
      u.partial(respond, res, raw)
    ).done();
  }
});


module.exports = router;
