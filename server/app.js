/*jshint node:true */
'use strict';

if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
} else {
  console.warn("New Relic agent not being started because NEW_RELIC_LICENSE_KEY is missing.");
}

const express = require('express'),
  morgan = require('morgan'),
  compress = require('compression'),
  cors = require('cors'),
  jsonp = require('./jsonp'),
  redirector = require('./redirector'),
  router = require('./router'),
  keen = require('./keen');

let app = express();

app.set('query parser', 'simple');
app.enable('trust proxy');

// logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(compress());
app.use(cors({
  maxAge: 60 * 60 * 24, // one day
  methods: ['GET']
}));
app.use(redirector.middleware);
app.use(jsonp);
app.use(express.static(`${__dirname}/..`));

const registerResponse = (req, res, event, start) => {
  let end = new Date().getTime();
  let resTime = end - start; // milliseconds
  console.log(req);
  console.log(`response time:: ${resTime}ms`);

  keen.recordEvent('reqEnd', {
    event: event,
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    resTime: resTime,
    ip: req.ips[0]
  });
};

app.use((req, res, next) => {
  let start = new Date().getTime();

  keen.recordEvent('reqStart', {
    method: req.method,
    path: req.path,
    ip: req.ips[0]
  });

  res.on('close', () => {
    registerResponse(req, res, 'close', start);
  });
  res.on('finish', () => {
    registerResponse(req, res, 'finish', start);
  });
  next();
});

app.use('/', router);

module.exports = app;
