/*jshint node:true */
/*global describe, it */
require('blanket')({
  pattern: 'lib',
  'data-cover-never': 'node_modules'
});

var supertest = require('supertest'),
  http = require('http'),
  express = require('express'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  app = require('../server/app.js'),
  redirector = require('../server/redirector.js');

require('sinon-mocha').enhance(sinon);

describe('app', function(){
  it('should give a status of 502 for a non-existent page', function(done){
    supertest(app)
      .get('/')
      .query({url: 'http://localhost:8001'})
      .expect(502, done);
  });

  it('should give a status of 502 for invalid JSON', function(done){
    var destApp = express();
    destApp.get('/', function(req, res){
      res.send('not JSON');
    });
    var server = http.createServer(destApp);
    server.listen(8001, function(){

      supertest(app)
        .get('/')
        .query({url: 'http://localhost:8001'})
        .expect(502)
        .expect('{"error":"not JSON"}', function(err){
          server.on('close', function(){
            done(err);
          });
          server.close();
        });

    });
  });

  it('should redirect if the REDIRECT_ORIGIN is set', function(done){
    sinon.stub(redirector, 'redirectOrigin').returns('http://redirected.com');

    supertest(app)
      .get('/')
      .query({url: 'http://localhost:8001', raw: true})
      .expect('location', 'http://redirected.com/?url=http%3A%2F%2Flocalhost%3A8001&raw=true')
      .expect(302, done);
  });

  describe('CORS', function(){
    it('should pass the JSON and set the CORS headers', function(done){
      var json = JSON.stringify({ message: 'test' });

      var destApp = express();
      destApp.get('/', function(req, res){
        res.send(json);
      });
      var server = http.createServer(destApp);
      server.listen(8001, function(){

        supertest(app)
          .get('/')
          .query({url: 'http://localhost:8001'})
          .expect('access-control-allow-origin', '*')
          .expect(json, function(err){
            server.on('close', function(){
              done(err);
            });
            server.close();
          });

      });
    });

    it("shouldn't send particular headers to the destination", function(done){
      var destApp = express();
      destApp.get('/', function(req, res){
        // echo the headers
        res.json(req.headers);
      });
      var server = http.createServer(destApp);
      server.listen(8001, function(){

        supertest(app)
          .get('/')
          .set('CF-Foo', 'abc123')
          .query({url: 'http://localhost:8001'})
          .end(function(err, res) {
            expect(res.body).to.eql({
              accept: 'application/json',
              connection: 'close',
              host: 'localhost:8001'
            });

            server.on('close', function(){
              done(err);
            });
            server.close();
          });

      });
    });

    it('should exclude particular headers from the destination', function(done){
      var json = JSON.stringify({ message: 'test' });

      var destApp = express();
      destApp.get('/', function(req, res){
        res.set({
          'Connection': 'blabla',
          'Server': 'CERN/3.0 libwww/2.17',
          'CF-Foo': 'abc123',
          'X-Frame-Options': 'SAMEORIGIN',
          // an arbitrary header, just to ensure they're getting passed
          'X-Foo': 'bar'
        });
        res.send(json);
      });
      var server = http.createServer(destApp);
      server.listen(8001, function(){

        supertest(app)
          .get('/')
          .query({url: 'http://localhost:8001'})
          .expect('access-control-allow-origin', '*')
          .expect('content-length', '18')
          .expect('connection', 'close')
          .expect('x-foo', 'bar')
          .expect(json, function(err, res){
            if (!err){
              expect(res.headers['x-foo']).to.be('bar'); // double-check
              expect(res.headers['cf-foo']).to.be(undefined);
              expect(res.headers.server).to.be(undefined);
              expect(res.headers['x-frame-options']).to.be(undefined);
            }

            server.on('close', function(){
              done(err);
            });
            server.close();
          });

      });
    });

    it('should pass the unescaped body for "raw" requests', function(done){
      var body = 'test " \' " escaping';

      var destApp = express();
      destApp.get('/', function(req, res){
        res.send(body);
      });
      var server = http.createServer(destApp);
      server.listen(8001, function(){

        supertest(app)
          .get('/')
          .query({url: 'http://localhost:8001', raw: true})
          .expect(body, function(err){
            server.on('close', function(){
              done(err);
            });
            server.close();
          });

      });
    });
  });

  describe('JSONP', function(){
    it('should wrap with callback name', function(done){
      var json = JSON.stringify({ message: 'test' });

      var destApp = express();
      destApp.get('/', function(req, res){
        res.send(json);
      });
      var server = http.createServer(destApp);
      server.listen(8001, function(){

        supertest(app)
          .get('/')
          .query({callback: 'foo', url: 'http://localhost:8001'})
          .expect('foo(' + json + ');', function(err){
            server.on('close', function(){
              done(err);
            });
            server.close();
          });

      });
    });

    it('should escape "raw" requests', function(done){
      var destApp = express();
      destApp.get('/', function(req, res){
        res.send('test " \' " </script> escaping');
      });
      var server = http.createServer(destApp);
      server.listen(8001, function(){

        supertest(app)
          .get('/')
          .query({callback: 'foo', url: 'http://localhost:8001', raw: true})
          .expect('foo({"data":"test \\" \' \\" <\\/script> escaping"});', function(err){
            server.on('close', function(){
              done(err);
            });
            server.close();
          });

      });
    });
  });
});
