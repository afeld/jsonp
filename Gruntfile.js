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
    mochaTest: {
      files: ['test/server/**/*_test.js']
    },
    watch: {
      files: jsFiles,
      tasks: 'default'
    }
  });

  // default tasks
  grunt.registerTask('default', ['env', 'mochaTest']);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');

  // server tests
  grunt.loadNpmTasks('grunt-mocha-test');
};
