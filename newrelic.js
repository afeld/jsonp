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
  app_name : ['JSONP'],
  logging : {
    filepath : 'stdout'
  }
};
