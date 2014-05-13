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

module.exports = function(grunt)
{

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
                'build/min.css': [
                    'css/reset.css',
                    'css/tortuga.css',
                    'css/tortoise.css',
                    'css/page.css'
                ]
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
            layout: "src/layouts/default.hbs",
            flatten: true
        },
        pages: {
            files: {
                '../www-public-src/build/www-public-release/': ['src/pages/*.hbs']
            }
        }
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
    }
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

  grunt.registerTask('test', [ 'rebase_test', 'nodeunit', 'jasmine', 'assemble', 'restore_test']);
  grunt.registerTask('release', ['rebase_www_public', 'concat', 'uglify', 'cssmin', 'assemble', 'restore_www_public']);
  grunt.registerTask('build2', ['test', 'jsdoc', 'assemble']);

  grunt.registerTask('default', ['test', 'jsdoc', 'release']);

};