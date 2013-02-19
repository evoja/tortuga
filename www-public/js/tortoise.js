var createTortoise;
var Tortoise;
var initTortoise = function(tortoiseContainer)
{
	var createTortoiseDiv = function()
	{
		var ttd = document.createElement("DIV");
		ttd.className = "om-tortoise-div";
		tortoiseContainer.appendChild(ttd);

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

	Tortoise = function(xx, yy, color)
	{		
		var ttdi = createTortoiseDiv();
		var ttd = ttdi.main;

		this.x = xx || 0;
		this.y = yy || 0;
		this.color = color || "#0a0";
		this.rotation = 180;
		this.isDrawing = false;

		this.getDivObject = function(){return ttdi}

		updateDiv(this);
	}

	var degToRad = function(deg)
	{
		return deg / 180 * Math.PI;
	}

	var radRot = function(t)
	{
		return Math.PI - degToRad(t.rotation);
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

	var proto = Tortoise.prototype;

	proto.go = function(length)
	{
		var t = this;
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

		updateDiv(t);
	}
	proto.fw = proto.go;
	proto.forward = proto.go;

	proto.rotate = function(deg)
	{
		deg = deg || 0;
		this.rotation -= deg;
		updateDiv(this);
	},
	proto.lt = proto.rotate;
	proto.rt = function(deg){this.rotate(deg ? -deg : 0)}

	proto.tailUp = function()
	{
		this.isDrawing = false;
		updateDiv(this);
	},
	proto.up = proto.tailUp;

	proto.tailDown = function()
	{
		this.isDrawing = true;
		updateDiv(this);
	},
	proto.dw = proto.tailDown;

	proto.setColor = function(c)
	{
		this.color = c || this.color;
		updateDiv(this);
	}

	createTortoise = function(xx, yy, color)
	{
		return new Tortoise(xx, yy, color);
	}
}