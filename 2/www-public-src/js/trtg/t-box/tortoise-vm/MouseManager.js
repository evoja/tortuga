om.ns_run('trtg.tbox.tortoise_vm', function(ns)
{
    var curry = om.ns_get('om.func.curry');

    var events = [
        'click', 'mousedown', 'mouseenter', 'mouseleave',
        'mousemove', 'mouseout', 'mouseover', 'mouseup',
        'mousewheel'
    ];

    var handle_event = function(tortuga_events_holder, drawing_system, e)
    {
        var point = drawing_system.convertCoordsCanvasToTortuga(e.layerX, e.layerY);
        var event_canvas = {
            tortugaX: point.x,
            tortugaY: point.y,
            originalEvent: e
        }

        var event_name = 'on' + e.type;
        if (typeof tortuga_events_holder[event_name] == 'function')
        {
            tortuga_events_holder[event_name](event_canvas);
        }
    };

    ns.MouseManager = function MouseManager(drawing_system) 
    {
        var tortuga_events_holder = om.ns('Tortuga.Events');
        events.forEach(function(event_name)
        {
            tortuga_events_holder['on' + event_name] = null;
        });


        var handler = curry(handle_event, tortuga_events_holder, drawing_system);

        this.subscribe_on_canvas = function(canvas) {
            events.forEach(function(event_name)
            {
                canvas.addEventListener(event_name, handler);
            });
        };

        this.unsubscribe_from_canvas = function(canvas) {
            events.forEach(function(event_name)
            {
                canvas.removeEventListener(event_name, handler);
            });
        };
    };
});