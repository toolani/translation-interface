module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      options: {
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    less: {
      development: {
        files: {
          "web/css/style.css": "src/css/style.less"
        }
      },
      production: {
        options: {
          compress: true,
          cleancss: true
        },
        files: {
          "web/css/style.min.css": "src/css/style.less"
        }
      }
    },
    browserify: {
      options: {
        transform: ['babelify', 'envify']
      },
      app: {
        src: "src/js/app.js",
        dest: "web/js/bundle.js",
        options: {}
      },
      watch: {
        src: "src/js/app.js",
        dest: "web/js/bundle.js",
        options: {
          watch: true,
          keepAlive: true
        }
      }
      
    },
    uglify: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        javascript: {
            files: {
              'web/js/bundle.min.js': ['<%= browserify.app.dest %>']
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('default', ['env:prod', 'less', 'browserify:app', 'uglify']);
  grunt.registerTask('bw', ['env:dev', 'browserify:watch']);
};