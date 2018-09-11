'use strict';
require('./support');

const expect = require('expect.js'),
  handleRequest = require('../../server/worker-helper');

describe('CloudFlare Worker', () => {
  it('should give a status of 502 for a non-existent page', () => {
    const req = new Request('http://localhost:8001/?url=http://localhost:8001');
    return handleRequest(req).catch(err => {
      expect(err.code).to.be('ECONNREFUSED');
    });
  });
});
