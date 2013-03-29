/*global module:false*/
module.exports = function(grunt) {

  var BUILD_PATH = "./build/eureka/public/";

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    meta: {
      version: '0.1.0'
    },
    banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* http://PROJECT_WEBSITE/\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      'YOUR_NAME; Licensed MIT */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      javascript: {
        src: ['./client/javascripts/*.js'],
        dest: BUILD_PATH + "javascripts/client.js"
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.javascript.dest %>',
        dest: BUILD_PATH + "javascripts/client-min.js"
      }
    },
    less: {
      options: {
        path: './client/less',
        yuicompress: true
      },
      dist: {
        src: ['./client/less/*.less'],
        dest: BUILD_PATH + "stylesheets/style-min.css"
      }
    },
    watch: {
      build: {
        files: './client/*/*',
        tasks: ['concat', 'uglify', 'less']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'uglify']);

};
