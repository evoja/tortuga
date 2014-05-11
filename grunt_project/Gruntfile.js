var combine_files = function() // prefix1, array1, prefix2, array2, ...
{
    if(arguments.length <= 1)
        return [];

    var prefix = arguments[0];
    var array = arguments[1];
    var result = [];
    array.forEach(function(elem){result.push(prefix + elem)});
    result = result.concat(combine_files.apply(this, Array.prototype.slice.call(arguments,2)));
    return result;
};


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
        src: ['../www-public/js/lib/rawdeflate.js',
        '../www-public/js/lib/rawinflate.js',
        '../www-public/js/Helper.js',
        '../www-public/js/Om.js',
        '../www-public/js/config.js',
        '../www-public/js/vm/DrawingSystem.js',
        '../www-public/js/vm/TortoiseRunner.js',
        '../www-public/js/vm/JsConverter.js',
        '../www-public/js/vm/Tortoise.js',
        '../www-public/js/vm/vm.js',
        '../www-public/js/files.js',
        '../www-public/js/help.js',
        '../www-public/js/Agent.js',
        '../www-public/js/lessons/lessons.js',
        '../www-public/js/lessons/ParamsUtil.js',
        '../www-public/js/tortuga.js',
        '../www-public/js/mouse.js'
        ],
        dest: '../www-public/build/min.js'
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['../www-public/js/lib/rawdeflate.js',
        '../www-public/js/lib/rawinflate.js',
        '../www-public/js/Helper.js',
        '../www-public/js/Om.js',
        '../www-public/js/config.js',
        '../www-public/js/vm/DrawingSystem.js',
        '../www-public/js/vm/TortoiseRunner.js',
        '../www-public/js/vm/JsConverter.js',
        '../www-public/js/vm/Tortoise.js',
        '../www-public/js/vm/vm.js',
        '../www-public/js/files.js',
        '../www-public/js/help.js',
        '../www-public/js/Agent.js',
        '../www-public/js/lessons/lessons.js',
        '../www-public/js/lessons/ParamsUtil.js',
        '../www-public/js/tortuga.js',
        '../www-public/js/mouse.js'
        ],
        dest: '../www-public/build/min.js'
      },
    },

    cssmin: {
      combine: {
        files: {
          '../www-public/build/min.css': 
              ['../www-public/css/reset.css',
              '../www-public/css/tortuga.css',
              '../www-public/css/tortoise.css',
              '../www-public/css/page.css']
        }
      }
    },


    watch: {
      scripts: {
        files: ['../www-public/js/lib/rawdeflate.js',
          '../www-public/js/lib/rawinflate.js',
          '../www-public/js/Helper.js',
          '../www-public/js/Om.js',
          '../www-public/js/config.js',
          '../www-public/js/vm/DrawingSystem.js',
          '../www-public/js/vm/TortoiseRunner.js',
          '../www-public/js/vm/JsConverter.js',
          '../www-public/js/vm/Tortoise.js',
          '../www-public/js/vm/vm.js',
          '../www-public/js/files.js',
          '../www-public/js/help.js',
          '../www-public/js/Agent.js',
          '../www-public/js/lessons/lessons.js',
          '../www-public/js/lessons/ParamsUtil.js',
          '../www-public/js/tortuga.js',
          '../www-public/js/mouse.js'
          ],
        tasks: ['uglify'],
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
                'www-public-src/js/', [
                    'om/om.ns.js',
                    'om/om.func.js',
                    'om/om.text.js',
                    'om/om.is_browser.js',
                    'lib/angular.js',
                    'trtg/**/*.js',
                    'angular_t-box_module.js'],
                '', ['www-public-test/lib/*.js']),
            options: {
                specs: 'www-public-test/**/*_jspec.js',
                helpers: 'www-public-test/**/*_jhelper.js'
            }
        }
    },

    jsdoc: {
        dist : {
            src: [
                '../2/www-public-src/js/**/*.js',
                '../2/www-public-test/**/*.js',
                '!../2/www-public-src/js/lib/**/*.js',
                '!../2/www-public-test/lib/**/*.js'
                ], 
            options: {
                destination: '../2/doc-js',
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
  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

  grunt.registerTask('rebase2', 'Set base path to ../2', function()
  {
    grunt.file.setBase('../2');
  });

  grunt.registerTask('rebase_default', 'Set base path to ../2', function()
  {
    grunt.file.setBase('../grunt_project');
  });

  grunt.registerTask('test', ['rebase2', 'nodeunit', 'jasmine', 'rebase_default']);
  grunt.registerTask('build2', ['test', 'jsdoc']);


};