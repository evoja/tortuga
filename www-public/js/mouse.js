ns("Tortuga.Events");
(function()
{
	Tortuga.initMouse = function(drawingSystem) 
	{
		drawingSystem.getCanvas().onclick = function(e)
		{
			var point = drawingSystem.convertCoordsCanvasToTortuga(e.layerX, e.layerY)
			var event_canvas_onclick = 
				{
					tortugaX: point.x,
					tortugaY: point.y,
					originalEvent: e
				}
				console.log("Event", event_canvas_onclick)

			if (typeof Tortuga.Events.onclick == "function")
			{
				Tortuga.Events.onclick(event_canvas_onclick);
			}
		}
	}
})()