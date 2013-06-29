ns("Tortuga.Vm");

(function()
{
	var TrTortoise = function(x, y, color, dsTortoise)
	{
		this.dsTortoise = dsTortoise
		this.x = x
		this.y = y
		this.deg = 0
		this.isDrawing = false
		this.color = color
	}

	var runCreate = function(x, y, color, runner)
	{
		dsTortoise = runner.drawingSystem.createTortoise()
		var trTortoise = new TrTortoise(x, y, color, dsTortoise)
		runner.tortoises.push(trTortoise)
		return trTortoise
	}

	var constructCreate = function(fun, x, y, color)
	{
		return function(runner){return runCreate(x, y, color, runner)}
	}

	//==== TortoiseRunner =======================================================

	var TortoiseRunner = function(drawingSystem)
	{
		this.drawingSystem = drawingSystem
		this.tortoises = []
	}

	TortoiseRunner.prototype = {
		run : function(command)
		{
			var runner = this;
			var result = command(runner)
			runner.tortoises.forEach(function(trt)
			{
				runner.drawingSystem.placeTortoise(
					trt.dsTortoise, trt.x, trt.y, trt.deg, trt.isDrawing, trt.color)
			})

			return result
		}
	}

	TortoiseRunner.commands = {
		constructCreate : constructCreate
	}

	Tortuga.Vm.TortoiseRunner = TortoiseRunner
})()