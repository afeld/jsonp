/*jshint node:true */
/*global describe, it */
'use strict';
require('../support');

const express = require('express');
const supertest = require('supertest');
const limiter = require('../../../server/limiters/ip');

let createApp = function(capacity) {
  let app = express();
  app.use(limiter(capacity));
  app.get('/', function(req, res) {
    res.end();
  });
  return app;
};

describe('IP limiter', function() {
  it("allows a single request through", function(done) {
    let app = createApp(3);
    supertest(app)
      .get('/')
      .expect('X-Rate-Limit-Remaining', 2)
      .expect(200, done);
  });

  it("blocks after a specified number of requests", function(done) {
    let app = createApp(1);
    supertest(app)
      .get('/')
      .expect('X-Rate-Limit-Remaining', 0)
      .expect(429, done);
  });
});
