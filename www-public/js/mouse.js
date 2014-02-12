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
				var event_name = e.type

			if (typeof Tortuga.Events.event_name == "function")
			{
				Tortuga.Events.event_name(event_canvas_onclick);
			}
			console.log(e.type)
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