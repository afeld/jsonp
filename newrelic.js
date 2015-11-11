/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 *
 * https://docs.newrelic.com/docs/nodejs/configuring-nodejs-with-environment-variables
 */
/*jshint node:true, strict:false */
exports.config = {
  app_name: ['JSONP'],
  capture_params: true,
  error_collector: {
    ignore_status_codes: [404, 429, 502]
  },
  logging: {
    filepath : 'stdout'
  }
};
