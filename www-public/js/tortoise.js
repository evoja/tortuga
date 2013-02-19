var createTortoise;
var Tortoise;
var initTortoise;

(function(){
	//=== Graph and HTML =====
	var createTortoiseDiv = function(container)
	{
		var ttd = document.createElement("DIV");
		ttd.className = "om-tortoise-div";
		container.appendChild(ttd);

		var pointer = document.createElement("DIV");
		pointer.className = "om-tortoise-pointer";
		ttd.appendChild(pointer);

		var color = document.createElement("DIV");
		color.className = "om-tortoise-color";
		ttd.appendChild(color);

		var image = document.createElement("DIV");
		image.className = "om-tortoise-image";
		ttd.appendChild(image);

		return {main:ttd, pointer:pointer, color:color};
	}

	var updateDiv = function(t)
	{
		var ttdi = t.getDivObject();
		var ttd = ttdi.main;
		var rad = radRot(t);
		var dx = ttd.offsetWidth * (Math.cos(rad)/2 + Math.sin(rad));
		var dy = ttd.offsetHeight * (Math.cos(rad) - Math.sin(rad) / 2);
		ttd.style.left = (t.x + dx) + "px";
		ttd.style.top =  (t.y + dy) + "px";
		ttd.style["-webkit-transform"] = "rotate(" + t.rotation + "deg)";
		ttd.style["-webkit-transform-origin"] = "0% 0%"

		ttdi.pointer.style.background = t.isDrawing ? t.color : "none";
		ttdi.color.style["border-color"] = t.color;
	}



	//=== Math ===
	var degToRad = function(deg)
	{
		return deg / 180 * Math.PI;
	}

	var radRot = function(t)
	{
		return Math.PI - degToRad(t.rotation);
	}


	//==== Construction helpers ====
	var applyMethodsToProto = function (methods, proto)
	{
		for(var key in methods)
		{
			proto[key] = (function(key){ return function()
			{
				var size = arguments.length;
				var args = [this];
				for(var j = 0; j < size; ++j)
				{
					args.push(arguments[j]);
				}
				methods[key].apply(null, args);
				updateDiv(t);
				return this;
			}})(key)
		}
	}

	var proto = {
		go : function(t, length)
		{
			length = length || 0;
			var ox = t.x;
			var oy = t.y;

			var rad = radRot(t);
			t.x += length * Math.sin(rad);
			t.y += length * Math.cos(rad);

			if(t.isDrawing)
			{
				oldColor = setColor(t.color);
				drawLine(ox, oy, t.x, t.y);
				setColor(oldColor);
			}
		},

		rotate : function(t, deg){t.rotation -= (deg || 0)},
		tailUp : function(t){t.isDrawing = false},
		tailDown : function(t){t.isDrawing = true},
		setColor : function(t, c){t.color = c || t.color}
	}
	proto.fw = proto.go;
	proto.forward = proto.go;
	proto.lt = proto.rotate;
	proto.rt = function(t, deg){t.rotate(deg ? -deg : 0)}
	proto.up = proto.tailUp;
	proto.dw = proto.tailDown;


	createTortoise = function(xx, yy, color)
	{
		return new Tortoise(xx, yy, color);
	}

	initTortoise = function(tortoiseContainer)
	{
		var TortoiseConstructor = function(xx, yy, color)
		{		
			var ttdi = createTortoiseDiv(tortoiseContainer);
			var ttd = ttdi.main;

			this.x = xx || 0;
			this.y = yy || 0;
			this.color = color || "#0a0";
			this.rotation = 180;
			this.isDrawing = false;

			this.getDivObject = function(){return ttdi}

			updateDiv(this);
		}
		applyMethodsToProto(proto, TortoiseConstructor.prototype);
		Tortoise = TortoiseConstructor;

		return TortoiseConstructor;
	}

})()