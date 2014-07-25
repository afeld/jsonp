/*global module:false*/
module.exports = function(grunt) {
  var jsFiles = ['*.js', 'lib/**/*.js', 'test/**/*.js'];

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
      tasks: 'default'
    }
  });

  // default tasks
  grunt.registerTask('default', ['jshint', 'mocha', 'mochaTest']);

  // JSHint
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // watch
  grunt.loadNpmTasks('grunt-contrib-watch');
  // client tests
  grunt.loadNpmTasks('grunt-mocha');
  // server tests
  grunt.loadNpmTasks('grunt-mocha-test');
};
