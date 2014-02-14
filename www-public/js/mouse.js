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
		canvas.onclick = handlerEvent
		canvas.onmousedown = handlerEvent
		canvas.onmouseenter = handlerEvent
		canvas.onmouseleave = handlerEvent
		canvas.onmousemove = handlerEvent
		canvas.onmouseout = handlerEvent
		canvas.onmouseover = handlerEvent
		canvas.onmouseup = handlerEvent
		canvas.onmousewheel = handlerEvent
	}
})()