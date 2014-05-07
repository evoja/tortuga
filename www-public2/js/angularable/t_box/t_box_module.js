(function() {

var curry = Om.curry;


var module = angular.module('t_box_module', [])

    .service('DispatcherService', Trtg.TBox.Ang.DispatcherService)
    .controller('DispatcherController', ['$scope', 'DispatcherService', Trtg.TBox.Ang.ServiceProxyController])
    .directive('consoleOut', curry(Trtg.TBox.Ang.ConsoleOutDirective, 'DispatcherController'))
    .directive('consoleIn', curry(Trtg.TBox.Ang.ConsoleInDirective, 'DispatcherController'))
    ;

})();
