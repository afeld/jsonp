'use strict';
require('./support');

const expect = require('expect.js'),
  nock = require('nock'),
  handleRequest = require('../../server/worker-helper');

describe('CloudFlare Worker', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should give a status of 502 for a non-existent page', () => {
    const req = new Request('http://jsonp.test/?url=http://localhost:8001');
    return handleRequest(req).catch(err => {
      expect(err.code).to.be('ECONNREFUSED');
    });
  });

  it('should pass the JSON and set the CORS headers', async () => {
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
});
