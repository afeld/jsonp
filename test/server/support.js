/*jshint node:true */
require('blanket')({
  pattern: 'lib',
  'data-cover-never': 'node_modules'
});

var sinon = require('sinon');
require('sinon-mocha').enhance(sinon);
