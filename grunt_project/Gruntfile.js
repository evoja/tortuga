
var path_debug = '../build/www-public-debug/';
var path_release = '../build/www-public-release/';
var path_jsdoc = '../build/doc-js/';
var path_src = '../www-public-src/';
var path_from_debugrelease = '../../grunt_project/';
var path_from_src = '../grunt_project/';
var path_debugrelease_to_src = '../../www-public-src/';

module.exports = function(grunt)
{
  var www_src_js_files = combine_files('js/', [
      'om/om.ns.js',
      'om/*.js',
      'trtg/t-box/tortoise-vm/TortoiseRunner.js',
      'trtg/**/*.js',
      '*.js',
      '!*.template.js'
  ]);

  var pages_config = {
    modules: {
      index: {
        css: combine_files('css/', [
                                    'reset.css',
                                    'tortuga.css',
                                    'tortoise.css',
                                    'page.css'
                                  ]),
        js: www_src_js_files,
        requires: ['js/lib/angular.js|auto']
      },
      perepravy: {
        js: ['lessons/perepravy_shapovalov.js'],
        requires: ['index']
      }
    },

    pages: [{
        template: 'index.html',
        modules: ['index']
      }, {
        template: 'perepravy.html',
        modules: ['perepravy']
      }
    ]
  };

  var register_tasks = function()
  {
    var register_rebase_task = function(task_name, path)
    {
      grunt.registerTask(task_name, 'Rebase to ' + path, function()
      {
        grunt.file.setBase(path);
      });
    };

    register_rebase_task('rebase_test', '..');
    register_rebase_task('restore_test', 'grunt_project');
    register_rebase_task('rebase_debug', path_debug);
    register_rebase_task('restore_debug', path_from_debugrelease);
    register_rebase_task('rebase_release', path_release);
    register_rebase_task('restore_release', path_from_debugrelease);

    grunt.registerTask('test', [
      'rebase_test',
      'nodeunit',
      'jasmine',
      'restore_test'
    ]);
    grunt.registerTask('debug', [
      'copy:debug',
      'rebase_debug',
      'sails-linker:debug_js',
      'sails-linker:debug_css',
      'restore_debug'
    ]);
    grunt.registerTask('release', [
      'copy:release',
      'uglify',
      'cssmin',
      'rebase_release',
      'sails-linker:release_js',
      'sails-linker:release_css',
      'restore_release'
    ]);
    // grunt.registerTask('clean', ['clean']);
    // grunt.registerTask('jsdoc', ['jsdoc']);
    grunt.registerTask('default', ['debug']);
  }

  var grunt_config = {
    //pkg: grunt.file.readJSON('package.json'),
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
                'www-public-src/', www_src_js_files,
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
    }
  };

  grunt.initConfig(process_pages_config(pages_config, grunt_config));

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

  register_tasks();
};

// That is all that relates to config.












// Modules and pages implementation

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

var invert_files = function(files)
{
  var result = []
  for (var i = 0; i < files.length; ++i)
  {
    var file_name = files[i]
    if(file_name.length > 0 && file_name.charAt(0) === '!')
    {
      result.push(file_name.substring(1));
    }
    else
    {
      result.push('!' + file_name);
    }
  }
  return result;
}

var get_minified_module_file_name = function(name, type) {
  return type + '/' + name + '.min.' + type;
}

var add_module = function(module, grunt_config)
{
  if (module.js)
  {
    grunt_config.uglify = grunt_config.uglify || {};
    grunt_config.uglify[module.name] = {
      src: combine_files(path_src, module.js),
      dest: path_release + get_minified_module_file_name(module.name, 'js')
    }

    grunt_config.jsdoc = grunt_config.jsdoc || {
      dist : {
        src: [], 
        options: {
          destination: '../build/doc-js',
          configure: 'jsdoc_conf.json'
        }
      }
    }
    // I don't sure what is better group packages docs by folders or 
    // compile it to one general folder.
    grunt_config.jsdoc.dist.src = grunt_config.jsdoc.dist.src.concat(combine_files(path_src, module.js));
    // grunt_config.jsdoc[module.name] = {
    //   src: combine_files(path_src, module.js),
    //   options: {
    //     destination: path_jsdoc + module.name,
    //     configure: 'jsdoc_conf.json'
    //   }
    // };
  }

  if (module.css)
  {
    grunt_config.cssmin = grunt_config.cssmin || {};
    grunt_config.cssmin[module.name] = {files: {}};
    var src_files = combine_files(path_src, module.css);
    var dest_file = path_release + get_minified_module_file_name(module.name, 'css');
    grunt_config.cssmin[module.name].files[dest_file] = src_files;
  }
};

var build_require_modules = function(module_name, modules)
{
  var result;
  var requires;
  if(typeof module_name === 'string')
  {
    result = [module_name];

    if (!modules[module_name])
    {
      return result;
    }

    requires = modules[module_name].requires;
  }
  else
  {
    result = [];
    requires = module_name;
  }

  for (var i = 0; i < requires.length; ++i)
  {
    var req_module_name = requires[i];
    var req_require_modules = build_require_modules(req_module_name, modules);
    for (var j = req_require_modules.length - 1; j >=  0; --j)
    {
      var req_req_module = req_require_modules[j];
      var pos_in_result = result.indexOf(req_req_module);
      if (pos_in_result > 0)
      {
        result.splice(pos_in_result, 1);
      }
      result.unshift(req_req_module);
    }
  }
  return result;
};

var get_file_name = function(name, is_debug)
{
  var regexp = new RegExp('(?:(.*\\.)(\\w+)(\\|auto)?$)', 'g');
  var reg_result = regexp.exec(name);
  var clean_name = reg_result[1];
  var extension = reg_result[2];
  var is_auto = !!reg_result[3];

  var file_name = is_debug || !is_auto
    ? clean_name + extension
    : clean_name + 'min.' + extension;
  return {name: file_name, extension: extension};
}

var extend_file_names = function(name, modules, files, grunt_config)
{
  if (modules[name])
  {
    var module = modules[name];
    module.name = name;
    add_module(module, grunt_config);
    if (module.js)
    {
      files.js_debug_files = files.js_debug_files.concat(module.js);
      files.js_release_files.push(get_minified_module_file_name(name, 'js'));
    }
    if (module.css)
    {
      files.css_debug_files = files.css_debug_files.concat(module.css);
      files.css_release_files.push(get_minified_module_file_name(name, 'css'));
    }
  }
  else
  {
    var file_debug = get_file_name(name, true);
    var file_release = get_file_name(name, false);

    if (file_debug.extension === 'js')
    {
      files.js_debug_files.push(file_debug.name);
      files.js_release_files.push(file_release.name);
    }
    else if (file_debug.extension === 'css')
    {
      files.css_debug_files.push(file_debug.name);
      files.css_release_files.push(file_release.name);
    }
  }
}

var add_page = function(page, modules, grunt_config)
{
  var requires = build_require_modules(page.modules, modules);
  var files = {
    js_debug_files: [],
    js_release_files: [],
    css_debug_files: [],
    css_release_files: []
  };

  for (var i = 0; i < requires.length; ++i)
  {
    extend_file_names(requires[i], modules, files, grunt_config);
  }

  var options_js = {
    startTag: '<!--SCRIPTS_JS-->',
    endTag: '<!--SCRIPTS_JS END-->',
    fileTmpl: '<script src="%s"></script>'
  };
  var options_css = {
    startTag: '<!--SCRIPTS_CSS-->',
    endTag: '<!--SCRIPTS_CSS END-->',
    fileTmpl: '<link type="text/css" rel="stylesheet" href="%s">'
  };
  grunt_config['sails-linker'] = grunt_config['sails-linker'] || {
    debug_js:{
      options: options_js,
      files: {}
    },
    debug_css:{
      options: options_css,
      files: {},
    },
    release_js:{
      options: options_js,
      files: {},
    },
    release_css:{
      options: options_css,
      files: {},
    }
  };

  var sl_conf = grunt_config['sails-linker'];
  var template = page.template;
  sl_conf.debug_js.files[template] = combine_files(path_debugrelease_to_src, files.js_debug_files);
  sl_conf.release_js.files[template] = files.js_release_files;
  sl_conf.debug_css.files[template] = combine_files(path_debugrelease_to_src, files.css_debug_files);
  sl_conf.release_css.files[template] = files.css_release_files;

  return files;
};

var process_pages_config = function(config, grunt_config)
{
  var debug_files = [];
  var release_files = [];

  for(var i = 0; i < config.pages.length; ++i)
  {
    var files = add_page(config.pages[i], config.modules, grunt_config);

    debug_files = debug_files.concat(files.js_debug_files).concat(files.css_debug_files);
    release_files = release_files.concat(files.js_release_files).concat(files.css_release_files);
  }

  grunt_config.copy = {
    debug: {
      files: [{
        expand: true,
        cwd: path_src,
        src: ['**/*.*', '**/.*'].concat(invert_files(debug_files)),
        dest: path_debug
      }]
    },
    release: {
      files: [{
        expand: true,
        cwd: path_src,
        src: ['**/*.*', '**/.*'].concat(invert_files(debug_files)).concat(release_files),
        dest: path_release
      }]
    }
  };

  return grunt_config;
}
