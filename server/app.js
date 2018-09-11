'use strict';

const express = require('express'),
  morgan = require('morgan'),
  cors = require('./app-helper').cors,
  jsonp = require('./jsonp'),
  path = require('path'),
  redirector = require('./redirector'),
  router = require('./router');

let app = express();

app.set('query parser', 'simple');
app.enable('trust proxy');

// logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(cors);
app.use(redirector.middleware);
app.use(jsonp);
app.use(express.static(path.join(__dirname, '..')));
app.use('/', router);

module.exports = app;
