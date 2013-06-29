ns("Tortuga");
var createTortoise;
var clearCanvas;

(function(){
	var prependArgumentsByObject = Om.prependArgumentsByObject;
	var TR = Tortuga.Vm.TortoiseRunner

	var createTrTortoise = function(tortoiseRunner, x, y, color, width)
	{
		var command = TR.constructCommand(TR.commands.create, x, y, color, width)
		return tortoiseRunner.run(command)
	}

	var go = function(t, length)
	{
		var command = TR.constructCommand(TR.commands.go, t.trTortoise, length)
		return t.tortoiseRunner.run(command)
	}

	var rotate = function(t, deg)
	{
		var command = TR.constructCommand(TR.commands.rotate, t.trTortoise, deg)
		return t.tortoiseRunner.run(command)
	}

	var tailUp = function(t)
	{
		var command = TR.constructCommand(TR.commands.tailUp, t.trTortoise)
		return t.tortoiseRunner.run(command)
	}

	var tailDown = function(t)
	{
		var command = TR.constructCommand(TR.commands.tailDown, t.trTortoise)
		return t.tortoiseRunner.run(command)
	}


	var setWidth = function(t, width)
	{
		var command = TR.constructCommand(TR.commands.setWidth, t.trTortoise, width)
		return t.tortoiseRunner.run(command)
	}

	var setColor = function(t, color)
	{
		var command = TR.constructCommand(TR.commands.setColor, t.trTortoise, color)
		return t.tortoiseRunner.run(command)
	}

	var clearCanvasCommand = function(tortoiseRunner)
	{
		var command = TR.constructCommand(TR.commands.clearCanvas)
		return tortoiseRunner.run(command)
	}

	var getColorUnderTail = function(t, forward)
	{
		var command = TR.constructCommand(TR.commands.getColorUnderTail, t.trTortoise, forward)
		return t.tortoiseRunner.run(command)
	}

	//=== Math ===
	var degToRad = function(deg)
	{
		return deg / 180 * Math.PI;
	}

	//==== Construction helpers ====
	var applyMethodsToProto = function (methods, proto, wrapMethod)
	{
		for(var key in methods)
		{
			proto[key] = wrapMethod(methods[key]);
		}
	}

	var wrapTortoisProtoMethod = function(fun)
	{
		return function()
		{
			var args = prependArgumentsByObject(this, arguments);
			fun.apply(null, args);
			return this;
		}
	}



	var proto = {
		go : go,
		rotate : rotate,
		tailUp : tailUp,
		tailDown : tailDown,
		setColor : setColor,
		setWidth : setWidth
	}
	proto.fw = proto.go;
	proto.forward = proto.go;
	proto.lt = proto.rotate;
	proto.rt = function(t, deg){t.rotate(deg ? -deg : 0)}
	proto.up = proto.tailUp;
	proto.dw = proto.tailDown;

	var Tortoise = function(xx, yy, color, width, tortoiseContainer, tortoiseRunner)
	{
		xx = xx === undefined ? tortoiseContainer.offsetWidth / 2 : xx;
		yy = yy === undefined ? tortoiseContainer.offsetHeight / 2 : yy;
		color = color || "#0a0";
		width = width || 1;


		this.tortoiseRunner = tortoiseRunner
		this.trTortoise = createTrTortoise(tortoiseRunner, xx, yy, color, width)
	}
	applyMethodsToProto(proto, Tortoise.prototype,
		wrapTortoisProtoMethod);
	Tortoise.prototype.repeat = function(count)
	{
		return new Tortuga.RepeatTortoise(this, count);
	}
	Tortoise.prototype.getColorUnderTail = function(forward)
	{
		return getColorUnderTail(this, forward)
	}

	Tortuga.Tortoise = Tortoise;
	Tortuga.initTortoise = function(tortoiseContainer, tortoiseRunner)
	{
		clearCanvas = function(){clearCanvasCommand(tortoiseRunner)}

		createTortoise = function(xx, yy, color, width)
		{
			return new Tortoise(xx, yy, color, width, tortoiseContainer, tortoiseRunner);
		}
	}
})()