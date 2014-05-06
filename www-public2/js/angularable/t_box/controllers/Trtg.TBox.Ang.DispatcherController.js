Om.ns("Trtg.TBox.Ang");

(function()
{

function DispatcherController(scope)
{
    var handlers = [];

    scope.add_handler = function(handler)
    {
        if(handlers.indexOf(handler) == -1)
        {
            handlers.push(handler);
        }
    };

    scope.remove_handler = function(handler)
    {
        var index = handlers.indexOf(handler);
        if(index >= 0)
        {
            handlers.splice(index, 1);
        }
    };

    scope.dispatch = function()
    {
        var context = this;
        var args = arguments;
        handlers.forEach(function(handler)
        {
            handler.apply(context, args);
        });
    };
};

Trtg.TBox.Ang.DispatcherController = DispatcherController;
})();
