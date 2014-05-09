(function() {
var ns_get = Om.ns_get;
var curry = ns_get("Om.curry");

var tbox_get = function(postfix){return ns_get("Trtg.TBox." + postfix)};
var tang_get = function(postfix){return ns_get("Trtg.TBox.Ang." + postfix)};


angular.module("t_box_module.TBoxTortoiseCanvas", [])
    .value("TBoxTortoiseCanvasBlock",
                 tbox_get("TBlocks.TortoiseCanvasBlock"))

    .service("TBoxTortoiseCanvasService",
                ["TBoxTortoiseCanvasBlock", tang_get("MethodsDispatcherService")])

    .controller("TBoxTortoiseCanvasController",
                ["$scope", "TBoxTortoiseCanvasService", tang_get("ServiceProxyController")])

    .directive("tboxTortoiseCanvas",
                curry(tang_get("TBlocks.TortoiseCanvasDirective"), "TBoxTortoiseCanvasController"))
    ;


angular.module("t_box_module", ["t_box_module.TBoxTortoiseCanvas"])
    .service("DispatcherService",
                tang_get("DispatcherService"))

    .controller("DispatcherController",
                ["$scope", "DispatcherService", tang_get("DispatcherController")])

    .directive("consoleOut",
                curry(tang_get("ConsoleOutDirective"), "DispatcherController"))

    .directive("consoleIn",
                curry(tang_get("ConsoleInDirective"), "DispatcherController"))
    ;

angular.bootstrap(document.getElementById("t_box_module"), ["t_box_module"]);




angular.module("other", []);
angular.bootstrap(document.getElementById("other_module"), ["other"]);

})();
