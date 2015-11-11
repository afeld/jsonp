/*global module:false*/
module.exports = function(grunt) {
  var jsFiles = ['*.js', 'server/**/*.js', 'test/**/*.js'];

  // Project configuration.
  grunt.initConfig({
    env: {
      dev: {
        NODE_ENV: 'test'
      }
    },
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
        undef: true,
        unused: true
      }
    },
    mocha: {
      index: ['test.html']
    },
    mochaTest: {
      files: ['test/server/**/*_test.js']
    },
    watch: {
      files: jsFiles,
      tasks: 'default'
    }
  });

  // default tasks
  grunt.registerTask('default', ['env', 'jshint', 'mocha', 'mochaTest']);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');

  // client tests
  grunt.loadNpmTasks('grunt-mocha');
  // server tests
  grunt.loadNpmTasks('grunt-mocha-test');
};
