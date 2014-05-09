Om.ns_run("Trtg.TBox.Ang.TBlocks", function(ns)
{
    ns.TortoiseCanvasDirective = function TortoiseCanvasDirective(dispatcherControllerName)
    {
        var link = function(scope, $element, attrs)
        {
            var slice = Om.ns_get("Array.prototype.slice");
            var canvas;
            var div;

            (function init(){
                var $canvas = $element.find("canvas");
                $canvas.attr("width", attrs.width).attr("height", attrs.height);
                $canvas.css("background", "#0ff");
                var $div = $element.find("div");
                $div.css("position", "relative");
                canvas = $canvas[0];
                div = $div[0];
            })();

            var block = new (Om.ns_get("Trtg.TBox.TBlocks.TortoiseCanvasBlock"))(canvas, div);

            var handler = function(commandName)
            {
                var args = slice.call(arguments, 1);
                return block[commandName].apply(block, args);
            };
            scope.add_handler(handler);

            $element.on("$destroy", function()
            {
                scope.remove_handler(handler);
            });

            // // Example 1: 
            // var t = block.createTortoise();
            // block.placeTortoise(t, 0, 0, 45, false, "#f00");
            // var text = $element.text();

            // // Example 2:
            // var service = angular.element(document.getElementById('t_box_module')).injector().get('TBoxTortoiseCanvasService');
            // var result = service.dispatch("createTortoise");
            // service.dispatch("placeTortoise", result, 0, 0, 45, false, "#f00");
        };

        return {
            restrict : "E",
            link : link,
            scope : {},
            controller : dispatcherControllerName,
            template: "<div><canvas></canvas></div>"
        };
    };
});