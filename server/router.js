'use strict';

const express = require('express');
const omit = require('lodash.omit');
const partial = require('lodash.partial');
const JSON3 = require('json3');
const snippets = require('./snippets');
const proxy = require('./proxy-request');
const cloudflare = require('./cloudflare');
const contentHelper = require('./content-helper');
const proxyUtil = require('./proxy_util');

let router = express.Router();

let serveLandingPage = function(res) {
  res.render('index.ejs', {
    layout: false,
    nodeVersion: process.version,
    snippets: snippets
  });
};

let passBackHeaders = function(incomingHeaders) {
  // remove those that node should generate
  let resultHeaders = omit(
    incomingHeaders,
    'connection',
    'content-length',
    'server',
    'x-frame-options'
  );

  return cloudflare.filterHeaders(resultHeaders);
};

let errorToJson = function(error) {
  let body = JSON3.stringify({ error: error.message });
  return {
    status: 502, // bad gateway
    body: body
  };
};

let respond = function(res, result) {
  res.status(result.status);

  if (!res.get('content-type')) {
    if (contentHelper.isValidJson(result.body)) {
      res.set('content-type', 'application/json');
    } else {
      res.set('content-type', 'text/plain');
    }
  }

  res.send(result.body);
};

let doProxy = function(apiUrl, req, res) {
  let promise = proxy(apiUrl, req);
  promise
    .then(function(response) {
      let responseHeaders = passBackHeaders(response.headers);
      res.set(responseHeaders);

      return {
        status: response.statusCode,
        body: response.body
      };
    })
    .fail(
      // keep this right before respond() to handle errors from any previous steps
      errorToJson
    )
    .then(partial(respond, res))
    .done();
};

router.head('/', function(req, res) {
  let apiUrl = proxyUtil.getApiUrl(req);
  if (apiUrl) {
    doProxy(apiUrl, req, res);
  } else {
    res.end();
  }
});

router.get('/', function(req, res) {
  let apiUrl = proxyUtil.getApiUrl(req);
  if (apiUrl) {
    doProxy(apiUrl, req, res);
  } else {
    serveLandingPage(res);
  }
});

module.exports = router;
