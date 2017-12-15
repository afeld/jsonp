/*jshint node:true */
'use strict';

const serverless = require('serverless-http'),
  app = require('./server/app.js');

module.exports.handler = serverless(app);
