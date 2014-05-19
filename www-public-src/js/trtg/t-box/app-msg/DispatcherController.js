om.ns_run('trtg.tbox.app_msg', function(ns)
{
var add_handler = function(handler)
{
    var scope = this;
    scope.handlers_.push(handler);
    scope.service_.add_handler(handler);
};

var remove_handler = function(handler)
{
    var scope = this;
    var index = scope.handlers_.indexOf(handler);
    if(index >= 0)
    {
        scope.handlers_.splice(index, 1);
    }
    scope.service_.remove_handler(handler);
};

var dispatch = function(var_args)
{
    var service = this.service_;
    return service.dispatch.apply(service, arguments);
};

var on_destroy_ = function()
{
    var scope = this;
    scope.handlers_.forEach(remove_handler.bind(scope));
};

function DispatcherController(scope, service)
{
    this.handlers_ = [];
    this.service_ = service;
    scope.$on('$destroy', on_destroy_.bind(this));
};

DispatcherController.prototype.add_handler = add_handler;
DispatcherController.prototype.remove_handler = remove_handler;
DispatcherController.prototype.dispatch = dispatch;

ns.DispatcherController = DispatcherController;
});
