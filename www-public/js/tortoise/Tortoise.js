ns("Tortuga");
var createTortoise;
var clearCanvas;

(function(){
	var prependArgumentsByObject = Om.prependArgumentsByObject;
	var TR = Tortuga.Vm.TortoiseRunner

	var createJsTortoise = function(jsConverter, x, y, color, width)
	{
		return jsConverter.parseNode(jsConverter.nodes.create, x, y, color, width)
	}

	var go = function(t, length)
	{
		return t.jsConverter.parseNode(t.jsConverter.nodes.go, t.jsTortoise, length)
	}

	var rotate = function(t, deg)
	{
		return t.jsConverter.parseNode(t.jsConverter.nodes.rotate, t.jsTortoise, deg)
	}

	var tailUp = function(t)
	{
		return t.jsConverter.parseNode(t.jsConverter.nodes.tailUp, t.jsTortoise)
	}

	var tailDown = function(t)
	{
		return t.jsConverter.parseNode(t.jsConverter.nodes.tailDown, t.jsTortoise)
	}


	var setWidth = function(t, width)
	{
		return t.jsConverter.parseNode(t.jsConverter.nodes.setWidth, t.jsTortoise, width)
	}

	var setColor = function(t, color)
	{
		return t.jsConverter.parseNode(t.jsConverter.nodes.setColor, t.jsTortoise, color)
	}

	var clearCanvasCommand = function(jsConverter)
	{
		return jsConverter.parseNode(jsConverter.nodes.clearCanvas)
	}

	var getColorUnderTail = function(t, forward)
	{
		return t.jsConverter.parseNode(t.jsConverter.nodes.getColorUnderTail, t.jsTortoise, forward)
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

	var Tortoise = function(xx, yy, color, width, tortoiseContainer, jsConverter)
	{
		xx = xx === undefined ? tortoiseContainer.offsetWidth / 2 : xx;
		yy = yy === undefined ? tortoiseContainer.offsetHeight / 2 : yy;
		color = color || "#0a0";
		width = width || 1;


		this.jsConverter = jsConverter
		this.jsTortoise = createJsTortoise(jsConverter, xx, yy, color, width)
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
	Tortuga.initTortoise = function(tortoiseContainer, jsConverter)
	{
		clearCanvas = function(){clearCanvasCommand(jsConverter)}

		createTortoise = function(xx, yy, color, width)
		{
			return new Tortoise(xx, yy, color, width, tortoiseContainer, jsConverter);
		}
	}
})()