'use strict';
require('./support');

import expect from 'expect.js';
import nock from 'nock';
import handleRequest from '../../server/worker-helper';

describe('JSONP', function() {
  afterEach(() => {
    nock.cleanAll();
  });

  it('gives a status of 502 for a non-existent page', () => {
    const req = new Request(
      'http://jsonp.test/?url=http://localhost:8001&callback=foo'
    );
    return handleRequest(req)
      .then(res => {
        expect(res.ok).to.be(false);
        return res.text();
      })
      .then(body => {
        expect(body).to.be(
          'foo({"error":"request to http://localhost:8001/ failed, reason: connect ECONNREFUSED 127.0.0.1:8001"});'
        );
      });
  });

  it('wraps with callback name', async () => {
    const destHost = 'http://localhost:8001';
    const json = { message: 'test' };
    nock(destHost)
      .get('/')
      .reply(200, json);

    const req = new Request(`http://jsonp.test/?url=${destHost}&callback=foo`);
    const res = await handleRequest(req);

    expect(res.status).to.be(200);
    const body = await res.text();
    expect(body).to.eql('foo(' + JSON.stringify(json) + ');');
  });

  it('escapes non-JSON requests', async () => {
    const destHost = 'http://localhost:8001';
    nock(destHost)
      .get('/')
      .reply(200, 'test " \' " </script> escaping');

    const req = new Request(`http://jsonp.test/?url=${destHost}&callback=foo`);
    const res = await handleRequest(req);

    expect(res.status).to.be(200);
    const body = await res.text();
    expect(body).to.eql(
      'foo({"data":"test \\" \' \\" <\\/script> escaping"});'
    );
  });
});
