'use strict';
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./component.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      less: {
        files: ['<%= yeoman.app %>/styles/less/**/*.less'],
        tasks: ['less:dev'],
        options: {
          livereload: false
        }
      },
      css: {
        files: ['{.tmp,<%= yeoman.app %>}/styles/**/*.css'],
        tasks: []
      },
      site: {
        files: [
          '<%= yeoman.app %>/*.html',
          '<%= yeoman.app %>/templates/**/*.html',
          '<%= yeoman.app %>/views/**/*.html',
          '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
              mountFolder(connect, yeomanConfig.app)
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
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
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
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    less: {
      dev: {
        files: {
          '.tmp/styles/main.css': '<%= yeoman.app %>/styles/less/main.less'
        }
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': '<%= yeoman.app %>/styles/less/main.less'
        }
      }
    },
    concat: {
      dist: {
        basic: {
          src: ['.tmp/concat/scripts/scripts.js'],
          dest: '<%= yeoman.dist %>/scripts/scripts.js'
        },
        extras: {
          src: ['.tmp/concat/lib/lib.js'],
          dest: '<%= yeoman.dist %>/lib/lib.js'
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: [
        '<%= yeoman.dist %>/index.html',
        '<%= yeoman.dist %>/404.html',
        '<%= yeoman.dist %>/views/**/*.html'
      ],
      css: [
        '.tmp/concat/styles/*.css',
        '<%= yeoman.dist %>/styles/**/*.css'
      ],
      options: {
        dirs: ['.tmp', '<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '<%= yeoman.dist %>/styles/**/*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
           // https://github.com/yeoman/grunt-usemin/issues/44
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
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'views/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/**/*.js',
            '<%= yeoman.dist %>/lib/**/*.js',
            '<%= yeoman.dist %>/styles/**/*.css'
            //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            //'<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
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
            dest: '<%= yeoman.dist %>',
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
    'coffee',
    'less:dev'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
//    'jshint',
    'less',
    'useminPrepare',
    //'imagemin',
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
