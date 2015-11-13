/*jshint node:true */
'use strict';

require('blanket')({
  pattern: 'lib',
  'data-cover-never': 'node_modules'
});

const sinon = require('sinon');
require('sinon-mocha').enhance(sinon);
