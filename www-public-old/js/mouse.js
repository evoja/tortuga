ns("Tortuga.Events");
(function()
{
	var tortugaEventsHolder = Tortuga.Events;

	Tortuga.initMouse = function(drawingSystem) 
	{
		var handlerEvent = function(e)
		{
			var point = drawingSystem.convertCoordsCanvasToTortuga(e.layerX, e.layerY)
			var event_canvas = 
				{
					tortugaX: point.x,
					tortugaY: point.y,
					originalEvent: e
				}

			var event_name = "on" + e.type
			if (typeof tortugaEventsHolder[event_name] == "function")
			{
				tortugaEventsHolder[event_name](event_canvas)
			}
		}

		var canvas = drawingSystem.getCanvas()
		var events = [
			"onclick", "onmousedown", "onmouseenter", "onmouseleave",
			"onmousemove", "onmouseout", "onmouseover", "onmouseup",
			"onmousewheel"
		]
		events.forEach(function(event_name)
		{
			canvas[event_name] = handlerEvent
			tortugaEventsHolder[event_name] = null
		})
	}
})()