/*global mocha, require, requirejs */
requirejs.config({
  paths: {
    jquery: '../public/bower_components/jquery/dist/jquery',
    jsonp: '../jsonp',
    URIjs: '../public/bower_components/URIjs/src'
  }
});

require(['jsonp', './client_test'], function() {
  mocha
    .globals([
      'jQuery*', // for JSONP
      'script*' // see http://stackoverflow.com/a/11166354/358804
    ])
    .run();
});
