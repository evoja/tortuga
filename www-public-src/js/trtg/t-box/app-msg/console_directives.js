om.ns_run('trtg.tbox.app_msg', function(ns)
{
    /**
     * Listens messages from scope and writes to element that is argumented by this directive.
     *
     * It was written as experiment and unnecessary now.
     * @deprecated
     * @memberOf  trtg.tbox.app_msg
     * @param {string} controllerName - name of controller that manages messages exchange.
     */
    function ConsoleOutDirective(controllerName)
    {
        var link = function(scope, $element, attrs)
        {
            var text = $element.text();
            var handler = function(message)
            {
                text += message;
                $element.text(text);
            }
            scope.add_handler(handler);

            $element.on('$destroy', function()
            {
                scope.remove_handler(handler);
            });
        };

        return {
            restrict : 'A',
            link : link,
            controller : controllerName
        };
    };

    /**
     * Sends typed in text as messages to scope.
     *
     * It was written as experiment and unnecessary now.
     * @deprecated
     * @memberOf  trtg.tbox.app_msg
     * @param {string} controllerName - name of controller that manages messages exchange.
     */
    function ConsoleInDirective(controllerName)
    {
        var link = function(scope, $element, attrs)
        {
            $element.on('keydown', function(event)
            {
                if(event.keyCode == 13)
                {
                    scope.dispatch($element.val());
                    $element.val('');
                    event.preventDefault();
                }
            });
        };

        return {
            restrict : 'A',
            link : link,
            controller : controllerName
        };
    };

    ns.ConsoleOutDirective = ConsoleOutDirective;
    ns.ConsoleInDirective = ConsoleInDirective;
});
