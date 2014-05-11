(function() {
var ns_get = Om.ns_get;
var curry = ns_get('Om.curry');

var tbox_get = function(postfix){return ns_get('Trtg.TBox.' + postfix)};
var tang_get = function(postfix){return ns_get('Trtg.TBox.Ang.' + postfix)};


angular.module('t_box_module.TBoxTortoiseCanvas', [])
    .value('TBoxTortoiseCanvasBlock',
                 tbox_get('TBlocks.TortoiseCanvasBlock'))

    .service('tbox_tortoise_canvas_service',
                ['TBoxTortoiseCanvasBlock', tang_get('MethodsDispatcherService')])

    .controller('TBoxTortoiseCanvasController',
                ['$scope', 'tbox_tortoise_canvas_service', tang_get('ServiceProxyController')])

    .directive('tboxTortoiseCanvas',
                curry(tang_get('TBlocks.TortoiseCanvasDirective'), 'TBoxTortoiseCanvasController'))
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
