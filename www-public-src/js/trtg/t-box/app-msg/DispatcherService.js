om.ns_run('trtg.tbox.app_msg', function(ns)
{
    /**
     * AngularJS service registers callbacks and dispatches messages to registered callbacks
     * @constructor
     * @memberof trtg.tbox.app_msg
     */
    function DispatcherService ()
    {
        var handlers = [];
        
        /**
         * Registers messages receiver if it wasn't registered before.
         * @param {function} handler - Messages receiver
         */
        this.add_handler = function(handler)
            {
                if(handlers.indexOf(handler) == -1)
                {
                    handlers.push(handler);
                }
            };

        /**
         * Removes messages receiver if it was registered.
         * @param {function} handler - Handler to remove
         */
        this.remove_handler = function(handler)
            {
                var index = handlers.indexOf(handler);
                if(index >= 0)
                {
                    handlers.splice(index, 1);
                }
            };

        /**
         * Dispatches messages to all registered handlers.
         * @returns {(undefined|!*)} - If there are only one handler is registered then its
         * returned value is returned.
         * If there are no or more than one handlers registered then {undefined} is returned.
         * @param {...*} - Arguments that will be passed to every handler.
         */
        this.dispatch = function(var_args)
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
            };
    };

    ns.DispatcherService = DispatcherService;
});
