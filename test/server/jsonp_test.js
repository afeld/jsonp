'use strict';
require('./support');

const supertest = require('supertest'),
  http = require('http'),
  express = require('express'),
  app = require('../../server/app.js');

describe('JSONP', function(){
  it('should give a status of 502 for a non-existent page', function(done){
    supertest(app)
      .get('/')
      .query({url: 'http://localhost:8001', callback: 'foo'})
      .expect(502, 'foo({"error":"connect ECONNREFUSED 127.0.0.1:8001"});', done);
  });

  it('should wrap with callback name', function(done){
    let json = JSON.stringify({ message: 'test' });

    let destApp = express();
    destApp.get('/', function(req, res){
      res.send(json);
    });
    let server = http.createServer(destApp);
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

  it('should escape non-JSON requests', function(done){
    let destApp = express();
    destApp.get('/', function(req, res){
      res.send('test " \' " </script> escaping');
    });
    let server = http.createServer(destApp);
    server.listen(8001, function(){

      supertest(app)
        .get('/')
        .query({callback: 'foo', url: 'http://localhost:8001'})
        .expect('foo({"data":"test \\" \' \\" <\\/script> escaping"});', function(err){
          server.on('close', function(){
            done(err);
          });
          server.close();
        });

    });
  });
});
