/*jshint node:true */
var express = require('express');
var url = require('url');
var requestp = require('./requestp');
var u = require('underscore');
var JSON3 = require('json3');
var snippets = require('./snippets');

var router = express.Router();


function isValidJson(str) {
  try {
    JSON3.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}


router.get('/', function(req, res) {
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
