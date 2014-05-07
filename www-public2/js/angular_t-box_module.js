(function() {

var curry = Om.ns_get("Om.curry");


var module = angular.module('t_box_module', [])

    .service('DispatcherService', Trtg.TBox.Ang.DispatcherService)
    .controller('DispatcherController', ['$scope', 'DispatcherService', Trtg.TBox.Ang.ServiceProxyController])
    .directive('consoleOut', curry(Trtg.TBox.Ang.ConsoleOutDirective, 'DispatcherController'))
    .directive('consoleIn', curry(Trtg.TBox.Ang.ConsoleInDirective, 'DispatcherController'))
    ;
angular.bootstrap(document.getElementById('t_box_module'), ['t_box_module']);

angular.module('other', []);
angular.bootstrap(document.getElementById('other_module'), ['other']);

})();
