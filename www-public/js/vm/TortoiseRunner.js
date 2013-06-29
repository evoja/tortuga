ns("Tortuga.Vm");

/**
Пример использования:

//короткий доступ к библиотеке:
var tr = Tortuga.Vm.TortoiseRunner

// создаём команду, создающую черепаху:
var command = tr.constructCommand(tr.commands.create, 100, 200, "green")

// создаём команды опускания и поднимания хвоста:
var td = tr.constructCommand(tr.commands.tailDown, t)
var tu = tr.constructCommand(tr.commands.tailUp, t)

// выполняем команду, черепаха создаётся:
var t = MyTr.run(command)

// создаём комадну, двигающую черепаху вперёд:
var goCommand = tr.constructCommand(tr.commands.go, t, 100)

// выполняем движение черепахи.
MyTr.run(td)
MyTr.run(goCommand)
MyTr.run(tu)
MyTr.run(goCommand)
MyTr.run(td)
MyTr.run(goCommand)

*/

/**
Пример использования последовательностей:

fun = function(n)
{
	var m1 = new Date().getMilliseconds()
	var tr = Tortuga.Vm.TortoiseRunner
	command = tr.constructCommand(tr.commands.create, 0, 0, "green")
	var t = MyTr.run(command)
	var pair = function(f, s){return tr.constructCommand(tr.commands.pair, f, s)}


	var td = tr.constructCommand(tr.commands.tailDown, t)
	var tu = tr.constructCommand(tr.commands.tailUp, t)
	var right = tr.constructCommand(tr.commands.rotate, t, -90)
	var left = tr.constructCommand(tr.commands.rotate, t, 90)

	var go = tr.constructCommand(tr.commands.go, t, 3)
	var kill = tr.constructCommand(tr.commands.kill, t)
	var nil = tr.constructCommand(tr.commands.nil)

	var seq = pair(nil, td)
	for(var i = 0; i < n;++i)
	{
	   seq = pair(pair(pair(pair(seq, left), go), right), go)
	}
	seq = pair(seq, kill)
	MyTr.run(seq)
	var m2 = new Date().getMilliseconds()
	return m2 - m1
}

fun(500)

fun2 = function(n)
{
	var m1 = new Date().getTime()
	var tr = Tortuga.Vm.TortoiseRunner
	command = tr.constructCommand(tr.commands.create, 0, 0, "green")
	var t = MyTr.run(command)

	var td = tr.constructCommand(tr.commands.tailDown, t)
	var tu = tr.constructCommand(tr.commands.tailUp, t)
	var right = tr.constructCommand(tr.commands.rotate, t, -90)
	var left = tr.constructCommand(tr.commands.rotate, t, 90)

	var go = tr.constructCommand(tr.commands.go, t, 3)
	var kill = tr.constructCommand(tr.commands.kill, t)

	var arr = [td, go]
	for(var i = 0; i < n;++i)
	{
		arr = arr.concat([left, go, right, go])
	}
	arr.push(kill)
	seq = tr.constructCommand(tr.commands.seq, arr)
	MyTr.run(seq)
	var m2 = new Date().getTime()
	return m2 - m1
}

fun2(10000)

*/


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
		this.width = 1
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
		if(moved)
		{
			ds.stroke()
		}
	}


	var runCreate = function(runner, x, y, color)
	{
		var dsTortoise = runner.drawingSystem.createTortoise()
		var trTortoise = new TrTortoise(x, y, color, dsTortoise)
		runner.tortoises.push(trTortoise)
		return trTortoise
	}

	var runGo = function(runner, trTortoise, length)
	{
		var isDrawing = trTortoise.isDrawing
		if(isDrawing)
		{
			appendPointToRunner(runner, new TrPoint(trTortoise, TR_POINT_MOVE))
		}

		var rad = degToRad(trTortoise.deg)
		trTortoise.x += length * Math.cos(rad)
		trTortoise.y += length * Math.sin(rad)

		if(isDrawing)
		{
			appendPointToRunner(runner, new TrPoint(trTortoise, TR_POINT_LINE))
		}
	}

	var runTailDown = function(runner, trTortoise)
	{
		trTortoise.isDrawing = true
	}

	var runTailUp = function(runner, trTortoise)
	{
		trTortoise.isDrawing = false
	}

	var runRotate = function(runner, trTortoise, deg)
	{
		trTortoise.deg += deg
	}

	var runSetColor = function(runner, trTortoise, color)
	{
		trTortoise.color = color
	}

	var runSetWidth = function(runner, trTortoise, width)
	{
		trTortoise.width = width
	}

	var runKill = function(runner, trTortoise)
	{
		var tortoises = runner.tortoises
		var index = tortoises.indexOf(trTortoise)

		if(index == -1)
			return

		tortoises.splice(index, 1)
		runner.drawingSystem.destroyTortoise(trTortoise.dsTortoise)
	}

	var runNil = function(runner){}

	var runPair = function(runner, first, second)
	{
		first(runner)
		return second(runner)
	}

	var runSeq = function(runner, arr)
	{
		var result = undefined
		arr.forEach(function(command){result = command(runner)})
		return result
	}

	var constructCommand = function()
	{
		var command = arguments[0]
		var args = arguments
		return function(runner)
		{
			args[0] = runner
			var result = command.apply(null, args)
			args[0] = command
			return result
		}
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
			var ds = runner.drawingSystem

			var result = command(runner)
			drawAllLines(runner)
			placeAllTortoises(runner)
			return result
		}
	}

	TortoiseRunner.commands = {
		create   : runCreate,
		go       : runGo,
		tailDown : runTailDown,
		tailUp   : runTailUp,
		rotate   : runRotate,
		setColor : runSetColor,
		setWidth : runSetWidth,
		kill     : runKill,
		nil      : runNil,
		pair     : runPair,
		seq      : runSeq
	}
	TortoiseRunner.constructCommand = constructCommand

	Tortuga.Vm.TortoiseRunner = TortoiseRunner
})()