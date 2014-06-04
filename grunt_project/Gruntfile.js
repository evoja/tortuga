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
    result = result.concat(combine_files.apply(this, Array.prototype.slice.call(arguments,2)));
    console.log(result);
    console.log('--------------------');
    return result;
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

module.exports = function(grunt)
{

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //version: 'dev',

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: combine_files('js/', www_src_js_files),
        dest: 'build/min.js'
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: combine_files('js/', www_src_js_files),
        dest: 'build/min.js'
      },
    },

    cssmin: {
        combine: {
            files: {
                'build/min.css': www_src_css_files
            }
        }
    },


    watch: {
      scripts: {
        files: combine_files('../www-public-src/js/', www_src_js_files),
        tasks: ['rebase_www_public', 'uglify', 'restore_www_public'],
        options: {
          spawn: false
        }
      }
    },

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
     
    assemble: {
          options: {
              layout: "templates/layouts/default.hbs",
              flatten: true,
              assets: 'site/src/**/*',
              helpers: 'templates/helpers/*.js',
              partials: 'templates/includes/*.hbs',
              layoutdir: 'templates/layouts',
              layout: 'default.hbs',
          },

          index: {
            files: {'../www-public-src/build/www-public-release/': ['btrtg/index.hbs']},
            options: {
              data: 'btrtg/*.json'
            }
          },

          perepravy: {
            files: {'../www-public-src/build/www-public-release/': ['btrtg/perepravy.hbs']},
            options: {
              data: 'btrtg/*.json'
            }
          },

          debug:{ 
            files: {
              '../www-public-src/build/www-public-release/index.html': ['btrtg/index.hbs'],
              '../www-public-src/build/www-public-release/perepravy.html': ['btrtg/perepravy.hbs']
            },
            options: {
              data: 'btrtg/json/dev/*.json'
            }
          },

          release:{ 
            files: {
              '../www-public-src/build/www-public-release/index.html': ['btrtg/index.hbs'],
              '../www-public-src/build/www-public-release/perepravy.html': ['btrtg/perepravy.hbs']
            },
            options: {
              data: 'btrtg/json/release/*.json'
            }
          },
    },

    clean: {
      dist: ['../www-public-src/build/www-public-release/*.html', '../www-public-src/build/*'],
      options: {
          force: true
        }
    },

    'sails-linker': {
        debug_js:{
              options: {
                startTag: '<!--SCRIPTS_JS-->',
                endTag: '<!--SCRIPTS_JS END-->',
                fileTmpl: '<script src="../%s"></script>',
                appRoot: '../www-public-src/build/'
              },
              files: {
                // Target-specific file lists and/or options go here.
                'templates/includes/scripts.hbs': combine_files('../www-public-src/build/', ['lib/angular.js'], '../www-public-src/build/', www_src_js_files)
                //['../www-public-src/build/*.js']
                
              },
        },

        debug_css:{
              options: {
                startTag: '<!--SCRIPTS_CSS-->',
                endTag: '<!--SCRIPTS_CSS END-->',
                fileTmpl: '<link type="text/css" rel="stylesheet" href="../%s">',
                appRoot: '../www-public-src/build/'
              },
              files: {
                // Target-specific file lists and/or options go here.
                'templates/includes/styles.hbs': ['../www-public-src/build/*.css']
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
                // Target-specific file lists and/or options go here.
                'app/index_linker.html': ['app/js/*.js']
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
                // Target-specific file lists and/or options go here.
                'app/index_linker.html': ['app/css/*.css']
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
      main: {
        files: [
          {expand: true, flatten: true, filter: 'isFile', cwd: '../www-public-src/', src: www_src_css_files, dest: '../www-public-src/build/'},
          {expand: true, flatten: true, filter: 'isFile', cwd: '../www-public-src/js/', src: www_src_js_files, dest: '../www-public-src/build/'}
        ]
      },
    },

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sails-linker');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('rebase_www_public', 'Set base path to ..', function()
  {
    grunt.file.setBase('../www-public-src');
  });

  grunt.registerTask('restore_www_public', 'Set base path to ..', function()
  {
    grunt.file.setBase('../grunt_project');
  });

  grunt.registerTask('rebase_test', 'Set base path to ..', function()
  {
    grunt.file.setBase('..');
  });

  grunt.registerTask('restore_test', 'Set base path to ../2', function()
  {
    grunt.file.setBase('grunt_project');
  });


  grunt.registerTask('test', [ 'rebase_test', 'nodeunit', 'jasmine', 'restore_test']);
  grunt.registerTask('release', ['clean', 'rebase_www_public', 'concat', 'uglify', 'cssmin', 'restore_www_public', 'sails-linker:debug_js', 'sails-linker:debug_css', 'assemble:release']);
  grunt.registerTask('build2', ['test', 'jsdoc', 'assemble']);
  grunt.registerTask('debug', ['clean', 'copy', 'sails-linker:debug_js', 'sails-linker:debug_css', 'assemble:debug']);

  grunt.registerTask('default', ['debug']);

};