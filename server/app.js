/*jshint node:true */
if (process.env.NODE_ENV === 'production' || process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

var express = require('express'),
  morgan = require('morgan'),
  compress = require('compression'),
  cors = require('cors'),
  jsonp = require('./jsonp'),
  router = require('./router');

var app = express();

app.set('query parser', 'simple');

// logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(compress());
app.use(cors({
  maxAge: 60 * 60 * 24, // one day
  methods: ['GET']
}));
app.use(jsonp);
app.use(express['static'](__dirname + '/..'));
app.use('/', router);


module.exports = app;
