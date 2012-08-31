/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      }
    },
    lint: {
      files: ['grunt.js', 'server.js', 'lib/**/*.js', 'test/**/*.js']
    },
    mocha: {
      index: ['public/test.html']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint mocha'
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint mocha');

  grunt.loadNpmTasks('grunt-mocha');
};
