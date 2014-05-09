(function() {

var curry = Om.ns_get("Om.curry");

angular.module('t_box_module.TBoxTortoiseCanvas', [])
    .value('TBoxTortoiseCanvasBlock', Om.ns_get("Trtg.TBox.TBlocks.TortoiseCanvasBlock"))
    .service('TBoxTortoiseCanvasService', ['TBoxTortoiseCanvasBlock', Om.ns_get("Trtg.TBox.Ang.MethodsDispatcherService")])
    .controller('TBoxTortoiseCanvasController', ['$scope', 'TBoxTortoiseCanvasService', Om.ns_get("Trtg.TBox.Ang.ServiceProxyController")])
    .directive('tboxTortoiseCanvas', curry(Trtg.TBox.Ang.TBlocks.TortoiseCanvasDirective, 'TBoxTortoiseCanvasController'))
    ;
angular.module('t_box_module', ['t_box_module.TBoxTortoiseCanvas'])
    .service('DispatcherService', Trtg.TBox.Ang.DispatcherService)
    .controller('DispatcherController', ['$scope', 'DispatcherService', Trtg.TBox.Ang.DispatcherController])
    .directive('consoleOut', curry(Trtg.TBox.Ang.ConsoleOutDirective, 'DispatcherController'))
    .directive('consoleIn', curry(Trtg.TBox.Ang.ConsoleInDirective, 'DispatcherController'))
    ;
angular.bootstrap(document.getElementById('t_box_module'), ['t_box_module']);

angular.module('other', []);
angular.bootstrap(document.getElementById('other_module'), ['other']);

})();
