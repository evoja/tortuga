var combine_files = function(prefix, array, post_array) {
    var result = [];
    array.forEach(function(elem){result.push(prefix + elem)});
    result = result.concat(post_array);
    return result;
};


module.exports = function(grunt) {

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
            src: combine_files('www-public-src/js/', [
                    'om/Om.ns.js',
                    'om/Om.func.js',
                    'om/Om.text.js',
                    'om/Om.is_browser.js',
                    'trtg/t-box/t-blocks/TortoiseCanvasBlock.js',
                    'lib/angular.js',
                    'trtg/t-box/ang/ServiceProxyController.js',
                    'trtg/t-box/ang/DispatcherService.js',
                    'trtg/t-box/ang/DispatcherController.js',
                    'trtg/t-box/ang/console_directives.js',
                    'trtg/t-box/ang/t-blocks/TortoiseCanvasDirective.js',
                    'angular_t-box_module.js'
                ],[
                    'www-public-test/lib/*.js'
                    // 'www-public-src/**/*.js'
                ]),
            options: {
                specs: 'www-public-test/**/*_jspec.js',
                helpers: 'www-public-test/**/*_jhelper.js'
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
  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

  grunt.registerTask('test', 'hi', function() {
    grunt.file.setBase('../2');
    grunt.task.run('nodeunit');
    grunt.task.run('jasmine');
  });

};