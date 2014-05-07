Om.ns("Trtg.TBox.Ang");

(function()
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
                    window.e = $element
                }
            });
        };

        return {
            restrict : 'A',
            link : link,
            controller : controllerName
        };
    };

    Trtg.TBox.Ang.ConsoleOutDirective = ConsoleOutDirective;
    Trtg.TBox.Ang.ConsoleInDirective = ConsoleInDirective;
})();
