om.ns_run('trtg.tbox.ang.tblocks', function(ns)
{
    ns.TortoiseCanvasDirective = function TortoiseCanvasDirective(dispatcherControllerName)
    {
        var link = function(scope, $element, attrs)
        {
            var slice = om.ns_get('Array.prototype.slice');
            var canvas;
            var div;

            (function init(){
                var $canvas = $element.find('canvas');
                $canvas.attr('width', attrs.width).attr('height', attrs.height);
                $canvas.css('background', '#0ff');
                var $div = $element.find('div');
                $div.css('position', 'relative');
                canvas = $canvas[0];
                div = $div[0];
            })();

            var block = scope.register_block(canvas, div);

            $element.on('$destroy', function()
            {
                scope.unregister_block(block);
            });

            // // Example 1: 
            // var t = block.createTortoise();
            // block.placeTortoise(t, 0, 0, 45, false, '#f00');
            // var text = $element.text();

            // // Example 2:
            // var service = angular.element(document.getElementById('t_box_module')).injector().get('tbox_tortoise_canvas_service');
            // var result = service.createTortoise();
            // service.placeTortoise(result, 0, 0, 45, false, '#f00');
        };

        return {
            restrict : 'E',
            link : link,
            scope : {},
            controller : dispatcherControllerName,
            template: '<div><canvas></canvas></div>'
        };
    };
});