Om.ns("Trtg.TBox.Ang");

(function()
{
    function ConsoleOutDirective()
    {
        var link = function(scope, element, attrs)
        {
            var text = element.text();
            var handler = function(message)
            {
                console.log('out', message);
                text += message;
                element.text(text);
            }
            scope.add_handler(handler);

            element.on('$destroy', function()
            {
                scope.remove_handler(handler);
            });
        };

        return {
            restrict : 'A',
            link : link
        };
    };

    function ConsoleInDirective()
    {
        var link = function(scope, element, attrs)
        {
            element.on('keydown', function(event)
            {
                if(event.keyCode == 13)
                {
	                console.log("in", element.val());
                    scope.dispatch(element.val());
                    element.val('');
                }
            });
        };

        return {
            restrict : 'A',
            link : link
        };
    };

    Trtg.TBox.Ang.ConsoleOutDirective = ConsoleOutDirective;
    Trtg.TBox.Ang.ConsoleInDirective = ConsoleInDirective;
})();
