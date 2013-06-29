ns("Tortuga");
var createTortoise;
(function(){
	var prependArgumentsByObject = Om.prependArgumentsByObject;

	var updateDiv = function(t)
	{
		t.drawingSystem.placeTortoise(t.getDsTortoise(), t.x, t.y, t.deg, t.isDrawing, t.color)
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
			updateDiv(this);
			return this;
		}
	}



	var proto = {
		go : function(t, length)
		{
			length = length || 0;
			var ox = t.x;
			var oy = t.y;

			var rad = degToRad(t);
			t.x += length * Math.cos(rad);
			t.y += length * Math.sin(rad);

			if(t.isDrawing)
			{
				var ds = t.drawingSystem

				ds.setColor(t.color)
				ds.setWidth(t.width)
				ds.beginPath()
				ds.moveTo(ox, oy)
				ds.lineTo(t.x, t.y)
				ds.stroke()
			}
		},

		rotate : function(t, deg){t.deg += (deg || 0)},
		tailUp : function(t){t.isDrawing = false},
		tailDown : function(t){t.isDrawing = true},
		setColor : function(t, c){t.color = c || t.color},
		setWidth : function(t, w){t.width = w || t.width},
		clearCanvas : function(t){t.drawingSystem.clearCanvas()}
	}
	proto.fw = proto.go;
	proto.forward = proto.go;
	proto.lt = proto.rotate;
	proto.rt = function(t, deg){t.rotate(deg ? -deg : 0)}
	proto.up = proto.tailUp;
	proto.dw = proto.tailDown;

	var Tortoise = function(xx, yy, color, width, tortoiseContainer, drawingSystem)
	{		
		this.drawingSystem = drawingSystem

		this.x = xx === undefined ? tortoiseContainer.offsetWidth / 2 : xx;
		this.y = yy === undefined ? tortoiseContainer.offsetHeight / 2 : yy;
		this.color = color || "#0a0";
		this.width = width || 1;
		this.deg = 0;
		this.isDrawing = false;

		var dsTortoise = drawingSystem.createTortoise()
		this.getDsTortoise = function(){return dsTortoise}

		updateDiv(this);
	}
	applyMethodsToProto(proto, Tortoise.prototype,
		wrapTortoisProtoMethod);
	Tortoise.prototype.repeat = function(count)
	{
		return new Tortuga.RepeatTortoise(this, count);
	}

	Tortoise.prototype.getColorUnderTail = function()
	{
		return getColorAt(this.x, this.y)
	}

	Tortuga.Tortoise = Tortoise;
	Tortuga.initTortoise = function(tortoiseContainer, drawingSystem)
	{
		createTortoise = function(xx, yy, color, width)
		{
			return new Tortoise(xx, yy, color, width, tortoiseContainer, drawingSystem);
		}
	}
})()