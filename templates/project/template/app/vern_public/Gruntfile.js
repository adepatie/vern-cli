/*
 *
 * Generated by VERN
 *
 */

'use strict';

module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  // configurable paths
  var vernConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    vernConfig.app = require('./bower.json').appPath || vernConfig.app;
  } catch (e) {
    grunt.fail.fatal(e);
  }

  grunt.initConfig({
    vern: vernConfig,
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      js: {
        files: ['<%= vern.app %>/scripts/**/*.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      less: {
        files: ['<%= vern.app %>/styles/less/**/*.less'],
        tasks: ['less:dev']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= vern.app %>/**/*.html',
          '.tmp/styles/**/*.css',
          '<%= vern.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect().use('/.tmp', connect.static('./.tmp')),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/{{assetsName}}',
                connect.static(require('path').resolve('../{{assetsName}}'))
              ),
              connect.static(vernConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect().use('/.tmp', connect.static('./.tmp')),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/{{assetsName}}',
                connect.static(require('path').resolve('../{{assetsName}}'))
              ),
              connect.static(vernConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= vern.dist %>'
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= vern.dist %>/*',
            '!<%= vern.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    wiredep: {
      options: {
        cwd: '.'
      },
      app: {
        src: ['<%= vern.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },
    less: {
      dev: {
        files: {
          '.tmp/styles/main.css': '<%= vern.app %>/styles/less/main.less'
        }
      },
      dist: {
        files: {
          '<%= vern.dist %>/styles/main.css': '.tmp/styles/main.css'
        }
      }
    },
    cssmin: {
      options: {
        rebase: false
      }
    },
    useminPrepare: {
      html: '<%= vern.app %>/index.html',
      options: {
        dest: '<%= vern.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: ['<%= vern.dist %>/**/*.html'],
      css: ['<%= vern.dist %>/styles/**/*.css'],
      options: {
        assetsDirs: ['<%= vern.dist %>','<%= vern.dist %>/images']
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= vern.app %>',
          src: ['*.html', 'views/**/*.html'],
          dest: '<%= vern.dist %>'
        }]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= vern.dist %>/*.html']
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '<%= vern.dist %>/scripts'
        }]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= vern.dist %>/scripts/**/*.js',
            '<%= vern.dist %>/lib/**/*.js',
            '<%= vern.dist %>/styles/**/*.css'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= vern.app %>',
          dest: '<%= vern.dist %>',
          src: [
            '*.html',
            '*.{ico,txt,png}',
            '.htaccess',
            'components/**/*',
            'lib/**/*',
            'images/**/*.{gif,webp,jpg,png,svg}',
            'styles/fonts/**/*',
            'styles/**/*.{gif,jpg,png}',
            'designer/**/*',
            'templates/**/*',
            'views/**/*'
          ]
        },
          {
            expand: true,
            dot: true,
            cwd: '.tmp/concat',
            dest: '<%= vern.dist %>',
            src: [
              'lib/**/*'
            ]
          }]
      }
    }
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'less:dev',
      'wiredep',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    if(!target) {
      target = 'dev';
    }
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'less:dev'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'less',
    'useminPrepare',
    'concat',
    'cssmin',
    'copy',
    'ngAnnotate',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', ['build']);
};
