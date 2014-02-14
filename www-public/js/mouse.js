ns("Tortuga.Events");
(function()
{
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
			if (typeof Tortuga.Events[event_name] == "function")
			{
				Tortuga.Events[event_name](event_canvas)
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
		})
	}
})()