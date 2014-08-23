
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
    modules: [{
        name: 'index',
        files: {
          css: combine_files('css/', [
                                  'reset.css',
                                  'tortuga.css',
                                  'tortoise.css',
                                  'page.css'
                                ]),
          js: www_src_js_files
        },
        requires: ['js/lib/angular.js|auto']
      },{
        name: 'perepravy',
        files: {
            js: ['lessons/perepravy_shapovalov.js']
        },
        requires: ['index']
      }
    ],

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

    grunt.registerTask('test', [
      'rebase_test',
      'nodeunit',
      'jasmine',
      'restore_test'
    ]);
    grunt.registerTask('debug', [
      'sails-linker:debug_js',
      'sails-linker:debug_css',
    ]);
    grunt.registerTask('release', [
      'copy:release',
      'uglify',
      'cssmin',
      'sails-linker:release_js',
      'sails-linker:release_css',
    ]);

    grunt.task.renameTask('clean', 'delete_build_files')
    grunt.registerTask('clean', [
        'delete_build_files',
        'sails-linker:clean_debug_js',
        'sails-linker:clean_debug_css'
    ]);
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

    delete_build_files: {
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
};

var build_modules_map = function(modules)
{
    var result = {};
    modules.forEach(function(module)
        {
            result[module.name] = module;
        });
    return result;
};

var get_module_from_modules = function(module_name, modules_list)
{
    return modules_list.filter(function(module)
        {
            return module.name === module_name;
        })[0];
}

var get_minified_module_file_name = function(name, type)
{
    return type + '/' + name + '.min.' + type;
}

var get_all_required_modules = function(module_name, modules_map)
{
    var result;
    var requires;
    if (typeof module_name === 'string')
    {
        result = [module_name];

        if (!modules_map[module_name])
        {
            return result;
        }

        requires = modules_map[module_name].requires;
    }
    else
    {
        result = [];
        requires = module_name;
    }
    requires.forEach(function(req_module_name)
    {
        var req_require_modules = get_all_required_modules(req_module_name, modules_map);
        for (var j = req_require_modules.length - 1; j >= 0; --j)
        {
            var req_req_module = req_require_modules[j];
            var pos_in_result = result.indexOf(req_req_module);
            if (pos_in_result > 0)
            {
                result.splice(pos_in_result, 1);
            }
            result.unshift(req_req_module);
        }
    });
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

var concat_module_files = function(left_map, right_map)
{
    var result = {}
    var process_map = function(map)
    {
        for(var type in map)
        {
            result[type] = result[type] || [];
            result[type] = result[type].concat(map[type]);
        }
    }

    process_map(left_map);
    process_map(right_map);
    return result;
}

var get_module_files = function(module_name, modules_map)
{
    var debug_files = {};
    var release_files = {};
    var module = modules_map[module_name];
    if (module)
    {
        debug_files = concat_module_files(debug_files, module.files);
        for(var type in module.files)
        {
            release_files[type] = release_files[type] || [];
            release_files[type].push(get_minified_module_file_name(module_name, type));
        }
    }
    else
    {
        var process_lib = function(is_debug, files)
        {
            var file = get_file_name(module_name, is_debug);
            var type = file.extension;
            files[type] = files[type] || [];
            files[type].push(file.name);
        }
        process_lib(true, debug_files);
        process_lib(false, release_files);
    }

    return {
        debug_files: debug_files,
        release_files: release_files
    };
}

var get_files_required_by_page_grouped_by_type = function(page, modules_map)
{
    var requires = get_all_required_modules(page.modules, modules_map);
    var debug_files = {};
    var release_files = {};
    requires.forEach(function(module_name)
    {
        var module_files = get_module_files(module_name, modules_map);
        debug_files = concat_module_files(debug_files, module_files.debug_files);
        release_files = concat_module_files(release_files, module_files.release_files);
    });

    return {
        debug_files: debug_files,
        release_files: release_files
    };
};

var get_files_required_by_page = function(page, modules_map)
{
    var result = {
        debug_files: [],
        release_files: []
    };

    var files = get_files_required_by_page_grouped_by_type(page, modules_map);
    var process = function(group_name)
    {
        for (type in files[group_name])
        {
            result[group_name] = result[group_name].concat(files[group_name][type]);
        }
    };
    process('debug_files');
    process('release_files');

    return result;
}




var config_task_uglify = function(module, grunt_config)
{
    if (!module.files.js)
        return;

    grunt_config.uglify = grunt_config.uglify || {};
    grunt_config.uglify[module.name] = {
      src: combine_files(path_src, module.files.js),
      dest: path_release + get_minified_module_file_name(module.name, 'js')
    }
}

var config_task_cssmin = function(module, grunt_config)
{
    if(!module.files.css)
        return;

    grunt_config.cssmin = grunt_config.cssmin || {};
    grunt_config.cssmin[module.name] = {files: {}};
    var src_files = combine_files(path_src, module.files.css);
    var dest_file = path_release + get_minified_module_file_name(module.name, 'css');
    grunt_config.cssmin[module.name].files[dest_file] = src_files;
}

var config_task_jsdoc = function(module, grunt_config)
{
    if(!module.files.js)
        return;

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
    grunt_config.jsdoc.dist.src = grunt_config.jsdoc.dist.src.concat(combine_files(path_src, module.files.js));
    // grunt_config.jsdoc[module.name] = {
    //   src: combine_files(path_src, module.files.js),
    //   options: {
    //     destination: path_jsdoc + module.name,
    //     configure: 'jsdoc_conf.json'
    //   }
    // };
};

var config_task_sailslinker = function(page, modules_map, grunt_config)
{
    var files = get_files_required_by_page_grouped_by_type(page, modules_map);
    var debug_files = files.debug_files;
    var release_files = files.release_files;

    var templates = {
        js: '<script src="%s"></script>',
        css: '<link type="text/css" rel="stylesheet" href="%s">'
    };
    var default_template = '%s';

    grunt_config['sails-linker'] = grunt_config['sails-linker'] || {};
    var sl_conf = grunt_config['sails-linker'];

    var process_files = function(files, task_group, dest_path)
    {
        for (var type in files)
        {
            var task_name = task_group + '_' + type;
            sl_conf[task_name] = sl_conf[task_name] || {
                options: {
                    startTag: '<!--SCRIPTS_' + type.toUpperCase() + '-->',
                    endTag: '<!--SCRIPTS_' + type.toUpperCase() + ' END-->',
                    fileTmpl: templates[type] || default_template,
                    appRoot: dest_path
                },
                files: {}
            };

            page_file_name = dest_path + page.template;
            sl_conf[task_name].files[page_file_name] = combine_files(dest_path, files[type]);
        }
    }
    process_files(debug_files, 'debug', path_src);
    process_files(release_files, 'release', path_release);

    var clean_debug_files = {};
    for (var type in debug_files)
    {
        clean_debug_files[type] = [];
    }
    process_files(clean_debug_files, 'clean_debug', path_src);
};

// /**
//  * Test JS from console via browse emulator by Jasmine tool.
//  * 
//  * Description of plugin is here: https://github.com/gruntjs/grunt-contrib-jasmine
//  * Description of jasmine is here: http://jasmine.github.io/1.3/introduction.html
//  */
// var config_task_jasmine = function(page, modules_map, grunt_config)
// {
//     var files = get_files_required_by_page_grouped_by_type(page, modules_map);
//     var js_files = files.debug_files.js;

//     if(!js_files)
//     {
//         return;
//     }

//     grunt_config.jasmine = grunt_config.jasmine || {};

//     grunt_config.jasmine[page.template] = {
//         src: combine_files(path_src, js_files),
//         options: {
//             specs: 'www-public-test/**/*_jspec.js',
//             helpers: 'www-public-test/**/*_jhelper.js'
//         }
//     };
// }

var config_task_copy = function(pages, modules_map, grunt_config)
{
    var debug_files = [];
    var release_files = [];
    pages.forEach(function(page)
    {
        var files = get_files_required_by_page(page, modules_map);
        debug_files = debug_files.concat(files.debug_files);
        release_files = release_files.concat(files.release_files);
    });
    grunt_config.copy = {
        // debug: {
        //     files: [{
        //         expand: true,
        //         cwd: path_src,
        //         src: ['**/*.*', '**/.*'].concat(invert_files(debug_files)),
        //         dest: path_debug
        //     }]
        // },
        release: {
            files: [{
                expand: true,
                cwd: path_src,
                src: ['**/*.*', '**/.*'].concat(invert_files(debug_files))
                                        .concat(release_files),
                dest: path_release
            }]
        }
    };
}

var process_pages_config = function(config, grunt_config)
{
    var modules_map = build_modules_map(config.modules);
    config_task_copy(config.pages, modules_map, grunt_config);
    config.modules.forEach(function(module)
    {
        config_task_uglify(module, grunt_config);
        config_task_cssmin(module, grunt_config);
        config_task_jsdoc(module, grunt_config);
    });
    config.pages.forEach(function(page)
    {
        config_task_sailslinker(page, modules_map, grunt_config);
//        config_task_jasmine(page, modules_map, grunt_config);
    });

    return grunt_config;
}
