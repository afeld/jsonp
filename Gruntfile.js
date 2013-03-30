/*global module:false*/
module.exports = function(grunt) {
  var defaults = ['jshint', 'mocha', 'mochaTest'],
    jsFiles = ['*.js', 'lib/**/*.js', 'test/**/*.js'];

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: jsFiles,
      options: {
        boss: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true
      }
    },
    mocha: {
      index: ['test.html']
    },
    mochaTest: {
      files: ['test/server_test.js']
    },
    watch: {
      files: jsFiles,
      tasks: defaults
    }
  });

  // default tasks
  grunt.registerTask('default', defaults);

  // JSHint
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // watch
  grunt.loadNpmTasks('grunt-contrib-watch');
  // client tests
  grunt.loadNpmTasks('grunt-mocha');
  // server tests
  grunt.loadNpmTasks('grunt-mocha-test');
};
