'use strict';

require('blanket')({
  pattern: 'lib',
  'data-cover-never': 'node_modules'
});

const fetch = require('node-fetch');
global.fetch = fetch;
global.Request = fetch.Request;
global.Response = fetch.Response;
