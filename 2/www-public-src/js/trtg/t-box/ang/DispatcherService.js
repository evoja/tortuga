om.ns_run('trtg.tbox.ang', function(ns)
{
    function DispatcherService ()
    {
        var handlers = [];
        return {
            add_handler : function(handler)
            {
                if(handlers.indexOf(handler) == -1)
                {
                    handlers.push(handler);
                }
            },

            remove_handler : function(handler)
            {
                var index = handlers.indexOf(handler);
                if(index >= 0)
                {
                    handlers.splice(index, 1);
                }
            },

            dispatch : function()
            {
                var context = this;
                var args = arguments;
                var process_handler = function(handler)
                {
                    return handler.apply(context, args);
                };

                if(handlers.length == 1)
                {
                    return process_handler(handlers[0]);
                }
                else
                {
                    handlers.forEach(process_handler);
                }
            }
        };
    };

    ns.DispatcherService = DispatcherService;
});
