'use strict';
require('./support');

const supertest = require('supertest'),
  http = require('http'),
  express = require('express'),
  expect = require('expect.js'),
  app = require('../../server/app.js');

describe('CORS', function() {
  it('should give a status of 502 for a non-existent page', function(done) {
    supertest(app)
      .get('/')
      .query({ url: 'http://localhost:8001' })
      .expect(
        502,
        {
          error: 'connect ECONNREFUSED 127.0.0.1:8001'
        },
        done
      );
  });

  it('should pass the JSON and set the CORS headers', function(done) {
    let json = JSON.stringify({ message: 'test' });

    let destApp = express();
    destApp.get('/', function(req, res) {
      res.send(json);
    });
    let server = http.createServer(destApp);
    server.listen(8001, function() {
      supertest(app)
        .get('/')
        .query({ url: 'http://localhost:8001' })
        .expect('access-control-allow-origin', '*')
        .expect(json, function(err) {
          server.on('close', function() {
            done(err);
          });
          server.close();
        });
    });
  });

  it('should handle HEAD requests', function(done) {
    let destApp = express();
    destApp.head('/', function(req, res) {
      res.end();
    });
    let server = http.createServer(destApp);
    server.listen(8001, function() {
      supertest(app)
        .head('/')
        .query({ url: 'http://localhost:8001' })
        .expect(200)
        .end(function(err) {
          server.on('close', function() {
            done(err);
          });
          server.close();
        });
    });
  });

  it("shouldn't send particular headers to the destination", function(done) {
    let destApp = express();
    destApp.get('/', function(req, res) {
      // echo the headers
      res.json(req.headers);
    });
    let server = http.createServer(destApp);
    server.listen(8001, function() {
      supertest(app)
        .get('/')
        .set('CF-Foo', 'abc123')
        .query({ url: 'http://localhost:8001' })
        .end(function(err, res) {
          expect(res.body).to.eql({
            accept: 'application/json',
            connection: 'close',
            host: 'localhost:8001'
          });

          server.on('close', function() {
            done(err);
          });
          server.close();
        });
    });
  });

  it('should exclude particular headers from the destination', function(done) {
    let json = JSON.stringify({ message: 'test' });

    let destApp = express();
    destApp.get('/', function(req, res) {
      res.set({
        Connection: 'blabla',
        Server: 'CERN/3.0 libwww/2.17',
        'CF-Foo': 'abc123',
        'X-Frame-Options': 'SAMEORIGIN',
        // an arbitrary header, just to ensure they're getting passed
        'X-Foo': 'bar'
      });
      res.send(json);
    });
    let server = http.createServer(destApp);
    server.listen(8001, function() {
      supertest(app)
        .get('/')
        .query({ url: 'http://localhost:8001' })
        .expect('access-control-allow-origin', '*')
        .expect('content-length', '18')
        .expect('connection', 'close')
        .expect('x-foo', 'bar')
        .expect(json, function(err, res) {
          if (!err) {
            expect(res.headers['x-foo']).to.be('bar'); // double-check
            expect(res.headers['cf-foo']).to.be(undefined);
            expect(res.headers.server).to.be(undefined);
            expect(res.headers['x-frame-options']).to.be(undefined);
          }

          server.on('close', function() {
            done(err);
          });
          server.close();
        });
    });
  });

  it('should pass the unescaped body', function(done) {
    let body = 'test " \' " escaping';

    let destApp = express();
    destApp.get('/', function(req, res) {
      res.send(body);
    });
    let server = http.createServer(destApp);
    server.listen(8001, function() {
      supertest(app)
        .get('/')
        .query({ url: 'http://localhost:8001' })
        .expect(body, function(err) {
          server.on('close', function() {
            done(err);
          });
          server.close();
        });
    });
  });
});
