(function() {

var module = angular.module('t_box_module', []);

module.controller('DispatcherController', ['$scope', Trtg.TBox.Ang.DispatcherController]);
module.directive('consoleOut', Trtg.TBox.Ang.ConsoleOutDirective);
module.directive('consoleIn', Trtg.TBox.Ang.ConsoleInDirective);

})();
