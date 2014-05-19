om.ns_run('trtg.tbox.app_msg', function(ns)
{
var add_handler = function(handler)
{
    var context = this;
    context.handlers_.push(handler);
    context.service_.add_handler(handler);
};

var remove_handler = function(handler)
{
    var context = this;
    var index = context.handlers_.indexOf(handler);
    if(index >= 0)
    {
        context.handlers_.splice(index, 1);
    }
    context.service_.remove_handler(handler);
};

var dispatch = function(var_args)
{
    var service = this.service_;
    return service.dispatch.apply(service, arguments);
};

var on_destroy_ = function()
{
    var context = this;
    context.handlers_.forEach(remove_handler.bind(context));
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
