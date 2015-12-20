/*jshint node:true */
'use strict';

if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
} else {
  console.warn("New Relic agent not being started because NEW_RELIC_LICENSE_KEY is missing.");
}
