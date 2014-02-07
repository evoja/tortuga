ns("Tortuga.Events");
(function()
{
	Tortuga.initMouse = function(drawingSystem) 
	{
		drawingSystem.getCanvas().onclick = function(e)
		{
			//drawingSystem.convertCoordsCanvasToTortuga
			console.log(e)
			console.log("canvas coords: {x: 100, y: 150}, tortuga coords: {x: 100, y: 250}")
		}
	}
})()