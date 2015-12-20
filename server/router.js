/*jshint node:true */
'use strict';

const express = require('express');
const u = require('underscore');
const JSON3 = require('json3');
const snippets = require('./snippets');
const proxy = require('./proxy-request');
const cloudflare = require('./cloudflare');
const contentHelper = require('./content-helper');
const proxyUtil = require('./proxy_util');
const qs = require('querystring');

let router = express.Router();


let serveLandingPage = function(req, res) {
  res.render('index.ejs', {
    layout: false,
    host: req.headers.host,
    nodeVersion: process.version,
    snippets: snippets
  });
};

let passBackHeaders = function(incomingHeaders) {
  // remove those that node should generate
  let resultHeaders = u.omit(incomingHeaders,
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

  if (!res.get('content-type')){
    if (contentHelper.isValidJson(result.body)){
      res.set('content-type', 'application/json');
    } else {
      res.set('content-type', 'text/plain');
    }
  }

  res.send(result.body);
};

let doProxy = function(apiUrl, req, res) {
  let promise = proxy(apiUrl, req);
  promise.then(
    function(response) {
      let responseHeaders = passBackHeaders(response.headers);
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
    u.partial(respond, res)
  ).done();
};


router.head('/', function(req, res) {
  let apiUrl = proxyUtil.getApiUrl(req);
  if (apiUrl){
    doProxy(apiUrl, req, res);
  } else {
    res.end();
  }
});

router.get('/', function(req, res) {
  let apiUrl = proxyUtil.getApiUrl(req);
  if (apiUrl){
    doProxy(apiUrl, req, res);
  } else {
    serveLandingPage(req, res);
  }
});

let defined = function(variable) {
  if (typeof variable !== 'undefined' && variable !== null)
    return true;
  return false;
}

router.post('/', function(req, res) {
  var body = '';

  req.on('data', function (data) {
    body += data;
    // Too much POST data, kill the connection!
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6)
      request.connection.destroy();
  });

  req.on('end', function () {
    var post = qs.parse(body);

    if (defined(post['url']) == false) {
      res.status(400);
      res.send('you shall not pass.');
    } else {
      let apiUrl = post['url'];

      if (defined(post['referer']) && post['referer']) {
        if (post['referer'] == "false") {
          req.headers = u.omit(req.headers, 'referer');
        } else {
          req.headers['referer'] = post['referer'];
        }
      } else {
        req.headers = u.omit(req.headers, 'referer');
      }

      if (defined(post['origin']) && post['origin']) {
        if (post['origin'] == "false") {
          req.headers = u.omit(req.headers, 'origin');
        } else {
          req.headers['origin'] = post['origin'];
        }
      } else {
        req.headers = u.omit(req.headers, 'origin');
      }

      if (defined(post['useragent']) && post['useragent']) {
        if (post['useragent'] == "false") {
          req.headers = u.omit(req.headers, 'user-agent');
        } else {
          req.headers['user-agent'] = post['useragent'];
        }
      } else {
        req.headers = u.omit(req.headers, 'user-agent');
      }

      if (defined(post['data'])) {
        // this is a post request for sure.
        req.method = 'POST';

        let postdata = post['data'];
        req.headers['content-length'] = postdata.length;

        // temporarily store post-data
        req.headers['x-post-data'] = postdata;
      } else {
        // strip content-length; there's no data
        req.headers = u.omit(req.headers,
          'content-length',
          'content-type'
        );
      }

      // finally call Proxy
      doProxy(apiUrl, req, res);
    }
  });
});

module.exports = router;
