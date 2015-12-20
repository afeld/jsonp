/*jshint node:true */
'use strict';

let newrelic;
if (process.env.NEW_RELIC_LICENSE_KEY) {
  newrelic = require('newrelic');
} else {
  console.warn("New Relic agent not being started because NEW_RELIC_LICENSE_KEY is missing.");
}

const url = require('url');

module.exports = {
  logRequest: function(uri) {
    if (newrelic) {
      let uriObj = url.parse(uri);
      newrelic.addCustomParameter('apiHostname', uriObj.hostname);
    }
  },

  logResponse: function(res) {
    if (newrelic) {
      newrelic.addCustomParameter('apiStatusCode', res.statusCode);
    }
  }
};
