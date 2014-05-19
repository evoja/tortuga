om.ns_run('trtg.tbox.app_msg', function(ns)
{
    /**
     * Listens messages from scope and writes to element that is argumented by this directive.
     *
     * It was written as experiment and unnecessary now.
     * @deprecated
     * @memberOf  trtg.tbox.app_msg
     * @param {string} controller_name - name of controller that manages messages exchange.
     */
    function ConsoleOutDirective(controller_name, controller_field)
    {
        var link = function(scope, $element, attrs)
        {
            var text = $element.text();
            var controller = scope[controller_field];
            var handler = function(message)
            {
                text += message;
                $element.text(text);
            }
            controller.add_handler(handler);

            $element.on('$destroy', function()
            {
                controller.remove_handler(handler);
            });
        };

        return {
            restrict : 'A',
            link : link,
            controller : controller_name + ' as ' + controller_field
        };
    };

    /**
     * Sends typed in text as messages to scope.
     *
     * It was written as experiment and unnecessary now.
     * @deprecated
     * @memberOf  trtg.tbox.app_msg
     * @param {string} controller_name - name of controller that manages messages exchange.
     */
    function ConsoleInDirective(controller_name, controller_field)
    {
        var link = function(scope, $element, attrs)
        {
            $element.on('keydown', function(event)
            {
                if(event.keyCode == 13)
                {
                    scope[controller_field].dispatch($element.val());
                    $element.val('');
                    event.preventDefault();
                }
            });
        };

        return {
            restrict : 'A',
            link : link,
            controller : controller_name + ' as ' + controller_field
        };
    };

    ns.ConsoleOutDirective = ConsoleOutDirective;
    ns.ConsoleInDirective = ConsoleInDirective;
});
