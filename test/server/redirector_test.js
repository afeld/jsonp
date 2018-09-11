/*global afterEach */
'use strict';
require('./support');

const supertest = require('supertest'),
  sandbox = require('sinon').sandbox.create(),
  express = require('express'),
  redirector = require('../../server/redirector.js');

describe('redirector', function() {
  afterEach(function () {
    sandbox.restore();
  });

  it('should redirect if the REDIRECT_ORIGIN is set', function(done) {
    sandbox.stub(redirector, 'redirectOrigin').returns('http://redirected.com');

    let app = express();
    app.use(redirector.middleware);

    supertest(app)
      .get('/')
      .query({ url: 'http://localhost:8001', callback: 'foo' })
      .expect(
        'location',
        'http://redirected.com/?url=http%3A%2F%2Flocalhost%3A8001&callback=foo'
      )
      .expect(302, done);
  });
});
