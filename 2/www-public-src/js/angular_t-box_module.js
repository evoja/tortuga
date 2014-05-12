(function() {
var ns_get = om.ns_get;
var curry = ns_get('om.func.curry');

var trtg_get = function(postfix){return ns_get('trtg.' + postfix)};
var tbox_get = function(postfix){return ns_get('trtg.tbox.' + postfix)};
var tang_get = function(postfix){return ns_get('trtg.tbox.ang.' + postfix)};


angular.module('t_box_module.TBoxTortoiseCanvas', [])
    .value('TBoxTortoiseCanvasBlock',
                 tbox_get('tblocks.TortoiseCanvasBlock'))

    .service('tbox_tortoise_canvas_service',
                ['TBoxTortoiseCanvasBlock', tang_get('MethodsDispatcherService')])

    .service('tbox_tortoisevm_tortoise-runner',
                ['tbox_tortoise_canvas_service', tbox_get('tortoise_vm.TortoiseRunner')])

    .service('tbox_tortoisevm_js-converter',
                ['tbox_tortoisevm_tortoise-runner', tbox_get('tortoise_vm.JsConverter')])

    .controller('TBoxTortoiseCanvasController',
                ['$scope', 'tbox_tortoise_canvas_service', tang_get('ServiceProxyController')])

    .directive('tboxTortoiseCanvas',
                curry(tang_get('tblocks.TortoiseCanvasDirective'), 'TBoxTortoiseCanvasController'))
    ;


angular.module('t_box_module', ['t_box_module.TBoxTortoiseCanvas'])
    .service('dispatcher_service',
                tang_get('DispatcherService'))

    .controller('DispatcherController',
                ['$scope', 'dispatcher_service', tang_get('DispatcherController')])

    .directive('consoleOut',
                curry(tang_get('ConsoleOutDirective'), 'DispatcherController'))

    .directive('consoleIn',
                curry(tang_get('ConsoleInDirective'), 'DispatcherController'))
    ;

angular.bootstrap(document.getElementById('t_box_module'), ['t_box_module']);




angular.module('other', []);
angular.bootstrap(document.getElementById('other_module'), ['other']);

})();
