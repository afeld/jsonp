/*jshint node:true */
/*global describe, it */
require('../support');

var express = require('express');
var supertest = require('supertest');
var limiter = require('../../../server/limiters/proxy');

var createApp = function(capacity) {
  var app = express();
  app.use(limiter(capacity));
  app.get('/', function(req, res) {
    res.end();
  });
  return app;
};

describe('proxy limiter', function() {
  it("allows a single request through", function(done) {
    var app = createApp(3);
    supertest(app)
      .get('/')
      .query({url: 'http://proxied.com'})
      .expect('X-Rate-Limit-Remaining', 2)
      .expect(200, done);
  });

  it("blocks after a specified number of requests", function(done) {
    var app = createApp(1);
    supertest(app)
      .get('/')
      .query({url: 'http://proxied.com'})
      .expect('X-Rate-Limit-Remaining', 0)
      .expect(429, done);
  });

  it("is bypassed when there's no API url", function(done) {
    var app = createApp(1);
    supertest(app)
      .get('/')
      .expect(200, done);
  });
});
