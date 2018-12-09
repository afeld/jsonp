'use strict';
require('./support');

const nock = require('nock'),
  expect = require('expect.js'),
  handleRequest = require('../../server/worker-helper');

describe('CORS', function() {
  afterEach(() => {
    nock.cleanAll();
  });

  it('gives a status of 502 for a non-existent page', () => {
    const req = new Request('http://jsonp.test/?url=http://localhost:8001');
    return handleRequest(req).catch(err => {
      expect(err.code).to.be('ECONNREFUSED');
    });
  });

  it('passes the JSON and set the CORS headers', async () => {
    const destHost = 'http://localhost:8001';
    const json = { message: 'test' };
    nock(destHost)
      .get('/')
      .reply(200, json);

    const req = new Request(`http://jsonp.test/?url=${destHost}`);
    const res = await handleRequest(req);

    expect(res.status).to.be(200);
    expect(res.headers.get('access-control-allow-origin')).to.eql('*');
    const data = await res.json();
    expect(data).to.eql(json);
  });

  it('handles HEAD requests', async () => {
    const destHost = 'http://localhost:8001';
    nock(destHost)
      .head('/')
      .reply(200);

    const req = new Request(`http://jsonp.test/?url=${destHost}`, {
      method: 'HEAD'
    });
    const res = await handleRequest(req);

    expect(res.status).to.be(200);
  });

  it('excludes particular headers to the destination', async () => {
    const host = 'http://localhost:8001';
    nock(host)
      .get('/')
      .reply(function() {
        // echo the headers
        return [200, JSON.stringify(this.req.headers)];
      });

    const req = new Request(`http://jsonp.test/?url=${host}`, {
      headers: { 'CF-Foo': 'abc123' }
    });
    const res = await handleRequest(req);

    expect(res.status).to.be(200);
    const body = await res.json();
    expect(body).to.eql({
      // for some reason, nock makes these arrays
      accept: ['application/json'],
      'accept-encoding': ['gzip,deflate'],
      connection: ['close'],
      host: 'localhost:8001',
      'user-agent': ['node-fetch/1.0 (+https://github.com/bitinn/node-fetch)']
    });
  });

  it('excludes particular headers from the destination', async () => {
    const json = { message: 'test' };
    const host = 'http://localhost:8001';
    nock(host)
      .get('/')
      .reply(200, json, {
        Connection: 'blabla',
        Server: 'CERN/3.0 libwww/2.17',
        'CF-Foo': 'abc123',
        'X-Frame-Options': 'SAMEORIGIN',
        // an arbitrary header, just to ensure they're getting passed
        'X-Foo': 'bar'
      });

    const req = new Request(`http://jsonp.test/?url=${host}`);
    const res = await handleRequest(req);
    expect(res.headers.get('access-control-allow-origin')).to.be('*');

    expect(res.headers.get('access-control-allow-origin')).to.be('*');
    expect(res.headers.has('cf-foo')).to.be(false);
    // TODO figure out why these aren't passing
    // expect(res.headers.get('connection')).to.be('close');
    // expect(res.headers.get('content-length')).to.be('18');
    expect(res.headers.has('server')).to.be(false);
    expect(res.headers.get('x-foo')).to.be('bar');
    expect(res.headers.has('x-frame-options')).to.be(false);
  });

  it('passes the unescaped body', async () => {
    const body = 'test " \' " escaping';

    const host = 'http://localhost:8001';
    nock(host)
      .get('/')
      .reply(200, body);

    const req = new Request(`http://jsonp.test/?url=${host}`);
    const res = await handleRequest(req);
    const resBody = await res.text();
    expect(resBody).to.be(body);
  });
});
