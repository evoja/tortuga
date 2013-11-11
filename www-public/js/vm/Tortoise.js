ns("Tortuga.Vm");
/**
Пользователе и черепахоориентированный интерфейс к JsConverter.
Передний край нашей программы.

Здесь определяются те команды, которым мы учим детей.
Посредством этих команд обычные люди управляют черепахой.

В абстрактном плане, это больше похоже на лексический анализатор.
Этот кусок программы принимает команды в виде элементарных вызовов,
который могут служить аналогом символов,
А на выходе получается набор лексем, который потом скармливается
в синтаксический анализатор - JsConverter.

В нашей программе команды для Tortoise вызываются самим пользователем:
* либо из консоли,
* либо из файла, который подгружается пользователем кнопочкой "Открыть файл"

*/

var createTortoise;
var clearCanvas;
var repeat;
var begin;
var end;
Tortuga.Vm.initTortoise;

(function(){
	var prependArgumentsByObject = Om.prependArgumentsByObject;
	var TR = Tortuga.Vm.TortoiseRunner

	var createJsTortoise = function(jsConverter, x, y, color, width, style_caps)
	{
		return jsConverter.parseNode(jsConverter.nodes.create, x, y, color, width, style_caps)
	}

	var getColorUnderTail = function(jsConverter, jsTortoise, forward)
	{
		return jsConverter.parseNode(jsConverter.nodes.getColorUnderTail, jsTortoise, forward).value
	}

	var getX = function(jsConverter, jsTortoise)
	{
		return jsConverter.parseNode(jsConverter.nodes.getX, jsTortoise).value
	}

	var getY = function(jsConverter, jsTortoise)
	{
		return jsConverter.parseNode(jsConverter.nodes.getY, jsTortoise).value
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
			capsRound: jsConverter.nodes.capsRound,
			capsSquare: jsConverter.nodes.capsSquare,
			setX: jsConverter.nodes.setX,
			getX: jsConverter.nodes.getX,
			setY: jsConverter.nodes.setY,
			getY: jsConverter.nodes.getY,
		}
	}


	Tortuga.Vm.initTortoise = function(tortoiseContainer, jsConverter)
	{
		var Tortoise = function(xx, yy, color, width, style_caps)
		{
			xx = xx === undefined ? tortoiseContainer.offsetWidth / 2 : xx;
			yy = yy === undefined ? tortoiseContainer.offsetHeight / 2 : yy;
			color = color || "#0a0";
			width = width || 1;
			style_caps = style_caps || "round";

			this.jsTortoise = createJsTortoise(jsConverter, xx, yy, color, width, style_caps)			
		}

		applyMethodsToProto(constructProto(jsConverter), Tortoise.prototype,
			function(node){return wrapTortoiseProtoMethod(node, jsConverter)});

		Tortoise.prototype.getColorUnderTail = function(forward)
		{
			return getColorUnderTail(jsConverter, this.jsTortoise, forward)
		}
		Tortoise.prototype.getX = function()
		{
			return getX(jsConverter, this.jsTortoise)
		}
		Tortoise.prototype.getY = function()
		{
			return getY(jsConverter, this.jsTortoise)
		}

		var proto = Tortoise.prototype
		proto.fw = proto.go;
		proto.forward = proto.go;
		proto.lt = proto.rotate;
		proto.rt = function(deg){return this.rotate(deg ? -deg : 0)}
		proto.up = proto.tailUp;
		proto.dw = proto.tailDown;


		clearCanvas = wrapNode(jsConverter.nodes.clearCanvas, jsConverter)
		begin = wrapNode(jsConverter.nodes.begin, jsConverter)
		repeat = wrapNode(jsConverter.nodes.repeat, jsConverter)
		end = wrapNode(jsConverter.nodes.end, jsConverter)

		createTortoise = function(xx, yy, color, width, style_caps)
		{
			return new Tortoise(xx, yy, color, width, style_caps, tortoiseContainer, jsConverter);
		}
	}
})()