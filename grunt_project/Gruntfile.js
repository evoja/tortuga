var combine_files = function() // prefix1, array1, prefix2, array2, ...
{
    if(arguments.length <= 1)
        return [];

    var prefix = arguments[0];
    var array = arguments[1];
    var result = [];
    array.forEach(function(elem)
        {
            if(elem.charAt(0) != '!')
            {
                result.push(prefix + elem);
            }
            else
            {
                result.push('!' + prefix + elem.substring(1));
            }
        });
    return result.concat(combine_files.apply(this, Array.prototype.slice.call(arguments,2)));
};

var www_src_js_files = [
    'om/om.ns.js',
    'om/*.js',
    'trtg/t-box/tortoise-vm/TortoiseRunner.js',
    'trtg/**/*.js',
    '*.js',
    '!*.template.js'
];

var www_src_css_files = [
    'css/reset.css',
    'css/tortuga.css',
    'css/tortoise.css',
    'css/page.css'
];

var path_debug = '../build/www-public-debug/';
var path_release = '../build/www-public-release/';
var path_src = '../www-public-src/';
var path_from_debugrelease = '../../grunt_project/';
var path_from_src = '../grunt_project/';
var path_debugrelease_to_src = '../../www-public-src/';


module.exports = function(grunt)
{
  var pkg = grunt.file.readJSON('package.json')

  grunt.initConfig({
    pkg: pkg,

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: combine_files(path_src + 'js/', www_src_js_files),
        dest: path_release + 'js/min.js'
      }
    },

    cssmin: {
        combine: {
            files: {
                'css/min.css': combine_files(path_debugrelease_to_src, www_src_css_files)
            }
        }
    },


    // watch: {
    //   scripts: {
    //     files: combine_files('../www-public-src/js/', www_src_js_files),
    //     tasks: ['rebase_www_public', 'uglify', 'restore_www_public'],
    //     options: {
    //       spawn: false
    //     }
    //   }
    // },

    // Test JS from console via NodeJS by NodeUnit tool.
    //
    // Description of plugin is here: https://github.com/caolan/nodeunit
    // https://github.com/gruntjs/grunt-contrib-nodeunit
    nodeunit: {
        all: ['www-public-test/**/*_nu-test.js'],
        options: {
            reporter: 'junit',
            reporterOptions: {
                output: 'outputdir'
            }
        }
    },

    // Test JS from console via browse emulator by Jasmine tool.
    //
    // Description of plugin is here: https://github.com/gruntjs/grunt-contrib-jasmine
    // Description of jasmine is here: http://jasmine.github.io/1.3/introduction.html
    jasmine: {
        pivotal: {
            src: combine_files(
                'www-public-src/js/', ['lib/angular.js'],
                'www-public-src/js/', www_src_js_files,
                '', ['www-public-test/lib/*.js']),
            options: {
                specs: 'www-public-test/**/*_jspec.js',
                helpers: 'www-public-test/**/*_jhelper.js'
            }
        }
    },

    clean: {
      dist: ['../build/**/*', '../build/**/.*'],
      options: {
        force: true
      }
    },

    'sails-linker': {
        debug_js:{
          options: {
            startTag: '<!--SCRIPTS_JS-->',
            endTag: '<!--SCRIPTS_JS END-->',
            fileTmpl: '<script src="%s"></script>',
            appRoot: path_debug
          },
          files: {
            'index.html': combine_files(path_debugrelease_to_src + 'js/', ['lib/angular.js'],
                                        path_debugrelease_to_src + 'js/', www_src_js_files),
            'perepravy.html': combine_files(path_debugrelease_to_src +'js/', ['lib/angular.js'],
                                            path_debugrelease_to_src +'js/', www_src_js_files,
                                            path_debugrelease_to_src, ['lessons/perepravy_shapovalov.js'])
          }
        },

        debug_css:{
          options: {
            startTag: '<!--SCRIPTS_CSS-->',
            endTag: '<!--SCRIPTS_CSS END-->',
            fileTmpl: '<link type="text/css" rel="stylesheet" href="%s">',
            appRoot: path_debug
          },
          files: {
            'index.html': combine_files(path_debugrelease_to_src, www_src_css_files),
            'perepravy.html': combine_files(path_debugrelease_to_src, www_src_css_files)
          },
        },

        release_js:{
          options: {
            startTag: '<!--SCRIPTS_JS-->',
            endTag: '<!--SCRIPTS_JS END-->',
            fileTmpl: '<script src="%s"></script>',
            appRoot: ''
          },
          files: {
            'index.html': ['js/lib/angular.js', 'js/min.js'],
            'perepravy.html': ['js/min.js', 'lessons/perepravy_shapovalov.js'],
          },
        },

        release_css:{
          options: {
            startTag: '<!--SCRIPTS_CSS-->',
            endTag: '<!--SCRIPTS_CSS END-->',
            fileTmpl: '<link type="text/css" rel="stylesheet" href="%s">',
            appRoot: ''
          },
          files: {
            'index.html': 'css/min.css',
            'perepravy.html': 'css/min.css',
          },
        },

    },

    jsdoc: {
        dist : {
            src: [
                '../www-public-src/js/**/*.js',
                '../www-public-test/**/*.js',
                '!../www-public-src/js/lib/**/*.js',
                '!../www-public-test/lib/**/*.js'
                ], 
            options: {
                destination: '../build/doc-js',
                configure: 'jsdoc_conf.json'
            }
        }
    },

    copy: {
      debug: {
        files: [{
          expand: true,
          flatten: false,
          filter: 'isFile',
          cwd: path_src,
          src: ['*.*', '.*', 'img/*.*'],
          dest: path_debug
        }]
      },
      release: {
        files: [{
          expand: true,
          flatten: false,
          filter: 'isFile',
          cwd: path_src,
          src: ['*.*', '.*', 'img/*.*', 'js/lib/**/*.*'],
          dest: path_release
        }]
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sails-linker');
  grunt.loadNpmTasks('grunt-contrib-copy');

  var registerRebaseTask = function(task_name, path)
  {
    grunt.registerTask(task_name, 'Rebase to ' + path, function()
    {
      grunt.file.setBase(path);
    });
  };

  registerRebaseTask('rebase_test', '..');
  registerRebaseTask('restore_test', 'grunt_project');
  registerRebaseTask('rebase_debug', path_debug);
  registerRebaseTask('restore_debug', path_from_debugrelease);
  registerRebaseTask('rebase_release', path_release);
  registerRebaseTask('restore_release', path_from_debugrelease);

  grunt.registerTask('test', [ 'rebase_test', 'nodeunit', 'jasmine', 'restore_test']);
  grunt.registerTask('debug', ['copy:debug', 'rebase_debug', 'sails-linker:debug_js', 'sails-linker:debug_css', 'restore_debug']);
  // grunt.registerTask('clean', ['clean']);
  grunt.registerTask('release', ['copy:release', 'uglify', 'rebase_release', 'cssmin', 'sails-linker:release_js', 'sails-linker:release_css', 'restore_release']);
  // grunt.registerTask('build2', ['test', 'jsdoc', 'assemble']);
  grunt.registerTask('default', ['debug']);

};