/* eslint-env node */
module.exports = function (config) {
  config.set({
    // plugins: ['karma-jquery'],
    frameworks: ['mocha', 'sinon', 'jquery-2.1.3'],
    files: [
      'node_modules/expect.js/index.js',
      'server/public/bower_components/URIjs/src/URI.js',
      'client/jsonp.js',
      'client/test/client_test.js',
    ],
  });
};
