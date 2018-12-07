'use strict';
require('./support');

const expect = require('expect.js'),
  nock = require('nock'),
  handleRequest = require('../../server/worker-helper');

describe('CloudFlare Worker', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('includes the status and headers', async () => {
    const destHost = 'http://localhost:8001';
    nock(destHost)
      .get('/')
      .reply(202, '', {
        'x-foo': 'bar'
      });

    const req = new Request(`http://jsonp.test/?url=${destHost}`);
    const res = await handleRequest(req);

    expect(res.status).to.be(202);
    expect(res.headers.get('x-foo')).to.eql('bar');
  });

  it('renders the homepage', async () => {
    const req = new Request(`http://jsonp.test/`);
    const res = await handleRequest(req);

    expect(res.status).to.be(200);
    expect(res.body).to.contain('Cross-domain AJAX');
  });
});
