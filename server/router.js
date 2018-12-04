'use strict';

const express = require('express');
const omit = require('lodash.omit');
const partial = require('lodash.partial');
const JSON3 = require('json3');
const proxy = require('./proxy-request');
const cloudflare = require('./cloudflare');
const contentHelper = require('./content-helper');
const proxyUtil = require('./proxy_util');

let router = express.Router();

let serveLandingPage = function(res) {
  res.sendfile('index.html', { root: __dirname + '/../public' });
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
      const responseHeaders = passBackHeaders(
        contentHelper.headersToObj(response.headers)
      );
      res.set(responseHeaders);

      return response.text().then(body => {
        return {
          status: response.status,
          body: body
        };
      });
    })
    .catch(
      // keep this right before respond() to handle errors from any previous steps
      errorToJson
    )
    .then(partial(respond, res));
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
