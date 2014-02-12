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

		drawingSystem.getCanvas().onmousedown = function(e){console.log("onmousedown")}

		drawingSystem.getCanvas().onmouseenter = function(e){console.log("onmouseenter")}

		drawingSystem.getCanvas().onmouseleave = function(e){console.log("onmouseleave")}

		drawingSystem.getCanvas().onmousemove = function(e){console.log("onmousemove")}

		drawingSystem.getCanvas().onmouseout = function(e){console.log("onmouseout")}

		drawingSystem.getCanvas().onmouseover = function(e){console.log("onmouseover")}

		drawingSystem.getCanvas().onmouseup = function(e){console.log("onmouseup")}

		drawingSystem.getCanvas().onmousewheel = function(e){console.log("onmousewheel")}

	}
})()