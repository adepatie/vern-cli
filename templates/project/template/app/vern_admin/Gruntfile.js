/*
 *
 * Generated by VERN
 *
 */

'use strict';
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var vernConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    vernConfig.app = require('./component.json').appPath || vernConfig.app;
  } catch (e) {}

  grunt.initConfig({
    vern: vernConfig,
    watch: {
      less: {
        files: ['<%= vern.app %>/styles/less/**/*.less'],
        tasks: ['less:dev'],
        options: {
          livereload: false
        }
      },
      css: {
        files: ['{.tmp,<%= vern.app %>}/styles/**/*.css'],
        tasks: []
      },
      site: {
        files: [
          '<%= vern.app %>/*.html',
          '<%= vern.app %>/templates/**/*.html',
          '<%= vern.app %>/views/**/*.html',
          '{.tmp,<%= vern.app %>}/scripts/**/*.js',
          '<%= vern.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      options: {
        livereload: 35730
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          hostname: '0.0.0.0',
          middleware: function (connect) {
            return [
              mountFolder(connect, '../assets/scripts'),
              mountFolder(connect, '.tmp'),
              mountFolder(connect, vernConfig.app)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://0.0.0.0:<%= connect.server.options.port %>'
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
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= vern.app %>/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
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
          '<%= vern.dist %>/styles/main.css': '<%= vern.app %>/styles/less/main.less'
        }
      }
    },
    concat: {
      dist: {
        basic: {
          src: ['.tmp/concat/scripts/scripts.js'],
          dest: '<%= vern.dist %>/scripts/scripts.js'
        },
        extras: {
          src: ['.tmp/concat/lib/lib.js'],
          dest: '<%= vern.dist %>/lib/lib.js'
        }
      }
    },
    useminPrepare: {
      html: '<%= vern.app %>/index.html',
      options: {
        dest: '<%= vern.dist %>'
      }
    },
    usemin: {
      html: [
        '<%= vern.dist %>/index.html',
        '<%= vern.dist %>/404.html',
        '<%= vern.dist %>/views/**/*.html'
      ],
      css: [
        '.tmp/concat/styles/*.css',
        '<%= vern.dist %>/styles/**/*.css'
      ],
      options: {
        dirs: ['.tmp', '<%= vern.dist %>']
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= vern.dist %>/styles/main.css': [
            '<%= vern.dist %>/styles/**/*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
           // https://github.com/vern/grunt-usemin/issues/44
           //collapseWhitespace: true,
           collapseBooleanAttributes: true,
           removeAttributeQuotes: true,
           removeRedundantAttributes: true,
           useShortDoctype: true,
           removeEmptyAttributes: true,
           removeOptionalTags: true*/
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
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '<%= vern.dist %>/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= vern.dist %>/scripts/scripts.js': [
            '<%= vern.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= vern.dist %>/scripts/**/*.js',
            '<%= vern.dist %>/lib/**/*.js',
            '<%= vern.dist %>/styles/**/*.css'
            //'<%= vern.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            //'<%= vern.dist %>/styles/fonts/*'
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
            '*.{ico,txt,png}',
            '.htaccess',
            'components/**/*',
            'lib/**/*',
            'images/**/*.{gif,webp,jpg,png}',
            'styles/fonts/**/*',
            'styles/**/*.{gif,jpg,png}',
            'designer/**/*',
            'templates/**/*'
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

  grunt.registerTask('server', [
    'clean:server',
    'less:dev',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'less:dev'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
//    'jshint',
    'less',
    'useminPrepare',
    'htmlmin',
    'concat',
    'cssmin',
    'copy',
    'ngmin',
//    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', ['build']);
};
