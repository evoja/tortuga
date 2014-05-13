om.ns_run('trtg.tbox.ang', function(ns)
{

function DispatcherController(scope, service)
{
    var handlers = [];

    scope.add_handler = function(handler) {
        handlers.push(handler);
        service.add_handler(handler);
    };
    scope.remove_handler = function(handler) {
        var index = handlers.indexOf(handler);
        if(index >= 0)
        {
            handlers.splice(index, 1);
        }
        service.remove_handler(handler);
    };
    scope.dispatch = service.dispatch.bind(service);

    scope.$on('$destroy', function() {
        handlers.forEach(scope.remove_handler);
    });
};

ns.DispatcherController = DispatcherController;
});
