(function() {
var ns_get = om.ns_get;
var curry = ns_get('om.func.curry');

var trtgvm_get = function(postfix){return ns_get('trtg.tbox.tortoise_vm.' + postfix)};
var tbox_get = function(postfix){return ns_get('trtg.tbox.' + postfix)};
var tang_get = function(postfix){return ns_get('trtg.tbox.ang.' + postfix)};


angular.module('t_box_module.TBoxTortoiseCanvas', [])
    .value('TBoxTortoiseCanvasBlock',
                 tbox_get('tblocks.TortoiseCanvasBlock'))

    .service('tbox_tortoise_canvas_service',
                ['TBoxTortoiseCanvasBlock', tang_get('MethodsDispatcherService')])

    .service('tbox_tortoisevm_tortoise_runner',
                ['tbox_tortoise_canvas_service', trtgvm_get('TortoiseRunner')])

    .service('tbox_tortoisevm_js_converter',
                ['tbox_tortoisevm_tortoise_runner', trtgvm_get('JsConverter')])

    .service('tbox_tortoisevm_tortoise_globals',
                ['tbox_tortoisevm_js_converter', trtgvm_get('TortoiseGlobals')])

    .controller('TBoxTortoiseCanvasController',
                ['$scope', 'tbox_tortoise_canvas_service', tang_get('ServiceProxyController')])

    .directive('tboxTortoiseCanvas',
                curry(tang_get('tblocks.TortoiseCanvasDirective'), 'TBoxTortoiseCanvasController'))
    .run(function($injector){
        $injector.get('tbox_tortoisevm_tortoise_globals');
    })
    ;


angular.module('t_box_module', ['t_box_module.TBoxTortoiseCanvas'])
    // .service('dispatcher_service',
    //             tang_get('DispatcherService'))

    // .controller('DispatcherController',
    //             ['$scope', 'dispatcher_service', tang_get('DispatcherController')])

    // .directive('consoleOut',
    //             curry(tang_get('ConsoleOutDirective'), 'DispatcherController'))

    // .directive('consoleIn',
    //             curry(tang_get('ConsoleInDirective'), 'DispatcherController'))
    ;

angular.bootstrap(document.getElementById('t_box_module'), ['t_box_module']);




// angular.module('other', []);
// angular.bootstrap(document.getElementById('other_module'), ['other']);

})();
