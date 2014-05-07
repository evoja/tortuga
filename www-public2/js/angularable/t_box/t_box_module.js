(function() {

var module = angular.module('t_box_module', [])

    .service('DispatcherService', Trtg.TBox.Ang.DispatcherService)
    .controller('DispatcherController', ['$scope', 'DispatcherService', Trtg.TBox.Ang.ServiceProxyController])
    .directive('consoleOut', Trtg.TBox.Ang.ConsoleOutDirective)
    .directive('consoleIn', Trtg.TBox.Ang.ConsoleInDirective)
    ;

})();
