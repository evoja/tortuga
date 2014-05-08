Om.ns_run("Trtg.TBox.Ang", function(ns)
{
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
