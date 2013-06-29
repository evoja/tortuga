ns("Tortuga.Vm");

(function()
{
	var TR_POINT_MOVE = {};
	var TR_POINT_LINE = {};

	//=== Math ===
	var degToRad = function(deg)
	{
		return deg / 180 * Math.PI;
	}

	//==== TortoiseRunner's language =====
	var TrTortoise = function(x, y, color, dsTortoise)
	{
		this.dsTortoise = dsTortoise
		this.x = x
		this.y = y
		this.deg = 0
		this.isDrawing = false
		this.color = color
	}


	var TrPoint = function(trTortoise, moveOrLine)
	{
		this.trTortoise = trTortoise
		this.x = trTortoise.x
		this.y = trTortoise.y
		this.color = trTortoise.color
		this.width = trTortoise.width
		this.moveOrLine = moveOrLine
	}
	TrPoint.prototype.equals = function(that)
	{
		return this.x == that.x && this.y == that.y && 
			this.color == that.color && this.width == that.width
			this.trTortoise == that.trTortoise
	}

	var appendPointToRunner = function(runner, trPoint)
	{
		var points = runner.points

		if(points.length == 0 || trPoint.moveOrLine == TR_POINT_LINE)
		{
			points.push(trPoint)
			return
		}

		var last = points[points.length - 1]

		if(last.moveOrLine == TR_POINT_MOVE)
		{
			points.pop()
			return appendPointToRunner(runner, trPoint)
		}

		if(!last.equals(trPoint))
		{
			points.push(trPoint)
			return
		}
	}

	var placeAllTortoises = function(runner)
	{
		var ds = runner.drawingSystem
		runner.tortoises.forEach(function(trt)
		{
			ds.placeTortoise(
				trt.dsTortoise, 
				trt.x, trt.y, trt.deg,
				trt.isDrawing, trt.color)
		})
	}

	var drawAllLines = function(runner)
	{
		var ds = runner.drawingSystem
		var moved = false
		runner.points.forEach(function(trPoint)
		{
			if(trPoint.moveOrLine == TR_POINT_MOVE)
			{
				if(moved)
				{
					ds.stroke()
				}
				else
				{
					moved = true
				}

				ds.beginPath()
				ds.setColor(trPoint.color)
				ds.setWidth(trPoint.width)
				ds.moveTo(trPoint.x, trPoint.y)
			}
			else
			{
				ds.lineTo(trPoint.x, trPoint.y)
			}
		})
		ds.stroke()
	}


	var runCreate = function(x, y, color, runner)
	{
		var dsTortoise = runner.drawingSystem.createTortoise()
		var trTortoise = new TrTortoise(x, y, color, dsTortoise)
		runner.tortoises.push(trTortoise)
		return trTortoise
	}

	var runGo = function(trTortoise, length, runner)
	{
		var isDrawing = true;//trTortoise.isDrawing
		if(isDrawing && runner.lastTortoise != trTortoise)
		{
			appendPointToRunner(runner, new TrPoint(trTortoise, TR_POINT_MOVE))
		}

		var rad = degToRad(trTortoise.deg)
		trTortoise.x += length * Math.cos(rad)
		trTortoise.y += length * Math.sin(rad)

		if(isDrawing)
		{
			appendPointToRunner(runner, new TrPoint(trTortoise, TR_POINT_LINE))
			runner.lastTortoise = trTortoise
		}
	}

	var constructCreate = function(x, y, color)
	{
		return function(runner){return runCreate(x, y, color, runner)}
	}

	var constructGo = function(trTortoise, length)
	{
		return function(runner){return runGo(trTortoise, length, runner)}
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
			var runner = this
			runner.points = []
			this.lastTortoise = null
			var ds = runner.drawingSystem

			var result = command(runner)
			drawAllLines(runner)
			placeAllTortoises(runner)
			return result
		}
	}

	TortoiseRunner.commands = {
		constructCreate : constructCreate,
		constructGo : constructGo
	}

	Tortuga.Vm.TortoiseRunner = TortoiseRunner
})()