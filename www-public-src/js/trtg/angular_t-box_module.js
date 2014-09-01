(function() {
var ns_get = om.ns_get;
var curry = ns_get('om.func.curry');

var trtgvm_get = function(postfix){return ns_get('trtg.tbox.tortoise_vm.' + postfix)};
var tbox_get = function(postfix){return ns_get('trtg.tbox.' + postfix)};
var tang_get = function(postfix){return ns_get('trtg.tbox.app_msg.' + postfix)};


angular.module('t_box_module.TBoxTortoiseCanvas', ['trtg.lessons.lessons_module'])
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

    .service('tbox_tortoisevm_mouse_manager',
                ['tbox_tortoise_canvas_service', trtgvm_get('MouseManager')])

    .service('tbox_tortoise_canvas_bg_dispatcher',
                tang_get('DispatcherService'))

    .controller('TBoxTortoiseCanvasController',
                [
                    '$scope', 
                    'tbox_tortoise_canvas_service', 
                    'tbox_tortoisevm_mouse_manager', 
                    'tbox_tortoise_canvas_bg_dispatcher',
                    'lesson_service',
                    tbox_get('tblocks.TortoiseCanvasController')
                ])

    .directive('tboxTortoiseCanvas',
                curry(tbox_get('tblocks.TortoiseCanvasDirective'), 'TBoxTortoiseCanvasController'))
    ;


angular.module('t_box_module', ['t_box_module.TBoxTortoiseCanvas'])
    .run(['$injector', function($injector){
        $injector.get('tbox_tortoisevm_tortoise_globals');
        $injector.get('tbox_tortoisevm_mouse_manager');
    }])
    ;

angular.bootstrap(document.getElementById('t_box_module'), ['t_box_module']);




// angular.module('other', []);
// angular.bootstrap(document.getElementById('other_module'), ['other']);

})();
