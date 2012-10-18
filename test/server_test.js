var assert = require('assert'),
  supertest = require('supertest'),
  http = require('http'),
  express = require('express'),
  app = require('../lib/app.js');

describe('app', function(){
  it('should give a status of 502 for a non-existent page', function(done){
    supertest(app)
      .get('/')
      .query({url: 'http://localhost:8001'})
      .expect(502, done);
  });

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

  it('should wrap with callback name, if provided', function(done){
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

  it('should not allow "raw" requests for JSONP', function(done){
    var body = 'test';

    var destApp = express();
    destApp.get('/', function(req, res){
      res.send(body);
    });
    var server = http.createServer(destApp);
    server.listen(8001, function(){

      supertest(app)
        .get('/')
        .query({callback: 'foo', url: 'http://localhost:8001', raw: true})
        .expect(403)
        .end(function(err){
          server.on('close', function(){
            done(err);
          });
          server.close();
        });
    });
  });

  it('should pass the raw body, if requested', function(done){
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
