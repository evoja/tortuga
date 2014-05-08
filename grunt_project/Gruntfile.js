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

    nodeunit: {
        all: ['../www-public2-test/example-test.js'],
        options: {
            reporter: 'junit',
            reporterOptions: {
                output: 'outputdir'
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
  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};