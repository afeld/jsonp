var assert = require('assert'),
  supertest = require('supertest'),
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

    var destApp = express.createServer();
    destApp.get('/', function(req, res){
      res.end(json);
    });
    destApp.listen(8001, function(){

      supertest(app)
        .get('/')
        .query({url: 'http://localhost:8001'})
        .expect('access-control-allow-origin', '*')
        .expect(json, function(err){
          destApp.on('close', function(){
            done(err);
          });
          destApp.close();
        });

    });
  });

  it('should wrap with callback name, if provided', function(done){
    var json = JSON.stringify({ message: 'test' });

    var destApp = express.createServer();
    destApp.get('/', function(req, res){
      res.end(json);
    });
    destApp.listen(8001, function(){

      supertest(app)
        .get('/')
        .query({callback: 'foo', url: 'http://localhost:8001'})
        .expect('foo(' + json + ');', function(err){
          destApp.on('close', function(){
            done(err);
          });
          destApp.close();
        });

    });
  });

  it('should not allow "raw" requests for JSONP', function(done){
    var body = 'test';

    var destApp = express.createServer();
    destApp.get('/', function(req, res){
      res.end(body);
    });
    destApp.listen(8001, function(){

      supertest(app)
        .get('/')
        .query({callback: 'foo', url: 'http://localhost:8001', raw: true})
        .expect(403)
        .end(function(err){
          destApp.on('close', function(){
            done(err);
          });
          destApp.close();
        });
    });
  });

  it('should pass the raw body, if requested', function(done){
    var body = 'test " \' " escaping';

    var destApp = express.createServer();
    destApp.get('/', function(req, res){
      res.end(body);
    });
    destApp.listen(8001, function(){

      supertest(app)
        .get('/')
        .query({url: 'http://localhost:8001', raw: true})
        .expect('"test \\" \' \\" escaping"', function(err){
          destApp.on('close', function(){
            done(err);
          });
          destApp.close();
        });

    });
  });
});
