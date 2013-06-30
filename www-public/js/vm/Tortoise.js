ns("Tortuga.Vm");
var createTortoise;
var clearCanvas;
var repeat;
var begin;
var end;

(function(){
	var prependArgumentsByObject = Om.prependArgumentsByObject;
	var TR = Tortuga.Vm.TortoiseRunner

	var createJsTortoise = function(jsConverter, x, y, color, width)
	{
		return jsConverter.parseNode(jsConverter.nodes.create, x, y, color, width)
	}

	var getColorUnderTail = function(jsConverter, jsTortoise, forward)
	{
		return jsConverter.parseNode(jsConverter.nodes.getColorUnderTail, jsTortoise, forward)
	}


	//==== Construction helpers ====
	var applyMethodsToProto = function (methods, proto, wrapMethod)
	{
		for(var key in methods)
		{
			proto[key] = wrapMethod(methods[key]);
		}
	}

	var wrapTortoiseProtoMethod = function(node, jsConverter)
	{
		return function()
		{
			var args = prependArgumentsByObject(this.jsTortoise, arguments);
			args = prependArgumentsByObject(node, args)
			jsConverter.parseNode.apply(jsConverter, args)
			return this;
		}
	}

	var wrapNode = function(node, jsConverter)
	{
		return function()
		{
			var args = prependArgumentsByObject(node, arguments)
			return jsConverter.parseNode.apply(jsConverter, args)
		}
	}

	var constructProto = function(jsConverter)
	{
		return {
			go: jsConverter.nodes.go,
			rotate: jsConverter.nodes.rotate,
			tailUp: jsConverter.nodes.tailUp,
			tailDown: jsConverter.nodes.tailDown,
			setColor: jsConverter.nodes.setColor,
			setWidth: jsConverter.nodes.setWidth,
		}
	}


	Tortuga.Vm.initTortoise = function(tortoiseContainer, jsConverter)
	{
		var Tortoise = function(xx, yy, color, width)
		{
			xx = xx === undefined ? tortoiseContainer.offsetWidth / 2 : xx;
			yy = yy === undefined ? tortoiseContainer.offsetHeight / 2 : yy;
			color = color || "#0a0";
			width = width || 1;

			this.jsTortoise = createJsTortoise(jsConverter, xx, yy, color, width)			
		}

		applyMethodsToProto(constructProto(jsConverter), Tortoise.prototype,
			function(node){return wrapTortoiseProtoMethod(node, jsConverter)});

		Tortoise.prototype.getColorUnderTail = function(forward)
		{
			return getColorUnderTail(jsConverter, this.jsTortoise, forward)
		}

		var proto = Tortoise.prototype
		proto.fw = proto.go;
		proto.forward = proto.go;
		proto.lt = proto.rotate;
		proto.rt = function(deg){this.rotate(deg ? -deg : 0)}
		proto.up = proto.tailUp;
		proto.dw = proto.tailDown;


		clearCanvas = wrapNode(jsConverter.nodes.clearCanvas, jsConverter)
		begin = wrapNode(jsConverter.nodes.begin, jsConverter)
		repeat = wrapNode(jsConverter.nodes.repeat, jsConverter)
		end = wrapNode(jsConverter.nodes.end, jsConverter)

		createTortoise = function(xx, yy, color, width)
		{
			return new Tortoise(xx, yy, color, width, tortoiseContainer, jsConverter);
		}
	}
})()