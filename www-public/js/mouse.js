ns("Tortuga.Events");
(function()
{
	Tortuga.initMouse = function(drawingSystem) 
	{
		var handlerEvent = function(e)
		{
			var point = drawingSystem.convertCoordsCanvasToTortuga(e.layerX, e.layerY)
			var event_canvas_onclick = 
				{
					tortugaX: point.x,
					tortugaY: point.y,
					originalEvent: e
				}
				var event_name = "on" + e.type

			if (typeof Tortuga.Events[event_name] == "function")
			{
				Tortuga.Events["on" + e.type](event_canvas_onclick)
			}
			

		}

		drawingSystem.getCanvas().onclick = function(e){handlerEvent(e)}

		drawingSystem.getCanvas().onmousedown = function(e){handlerEvent(e)}

		drawingSystem.getCanvas().onmouseenter = function(e){handlerEvent(e)}

		drawingSystem.getCanvas().onmouseleave = function(e){handlerEvent(e)}

		drawingSystem.getCanvas().onmousemove = function(e){handlerEvent(e)}

		drawingSystem.getCanvas().onmouseout = function(e){handlerEvent(e)}

		drawingSystem.getCanvas().onmouseover = function(e){handlerEvent(e)}

		drawingSystem.getCanvas().onmouseup = function(e){handlerEvent(e)}

		drawingSystem.getCanvas().onmousewheel = function(e){handlerEvent(e)}

	}
})()