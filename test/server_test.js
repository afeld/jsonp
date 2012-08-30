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
    destApp.on('close', done);
    destApp.listen(8001, function(){

      supertest(app)
        .get('/')
        .query({url: 'http://localhost:8001'})
        .expect('access-control-allow-origin', '*')
        .expect(json, function(){
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
    destApp.on('close', done);
    destApp.listen(8001, function(){

      supertest(app)
        .get('/')
        .query({callback: 'foo', url: 'http://localhost:8001'})
        .expect('foo(' + json + ');', function(){
          destApp.close();
        });

    });
  });
});
