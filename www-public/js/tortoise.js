var createTortoise;
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

	createTortoise = function(xx, yy, color)
	{
		var ttdi = createTortoiseDiv();
		var ttd = ttdi.main;

		var x = xx || 0;
		var y = yy || 0;
		var color = color || "#0a0";
		var rotation = 180;
		var isDrawing = false;

		var radRot = function()
		{
			return Math.PI - degToRad(rotation);
		}

		var updateDiv = function()
		{
			var rad = radRot();
			var dx = ttd.offsetWidth * (Math.cos(rad)/2 + Math.sin(rad));
			var dy = ttd.offsetHeight * (Math.cos(rad) - Math.sin(rad) / 2);
			ttd.style.left = (x + dx) + "px";
			ttd.style.top =  (y + dy) + "px";
			ttd.style["-webkit-transform"] = "rotate(" + rotation + "deg)";
			ttd.style["-webkit-transform-origin"] = "0% 0%"

			ttdi.pointer.style.background = isDrawing ? color : "none";
			ttdi.color.style["border-color"] = color;
		}

		var degToRad = function(deg)
		{
			return deg / 180 * Math.PI;
		}

		var tortoise = {
			go: function(length)
			{
				length = length || 0;
				var ox = x;
				var oy = y;

				var rad = radRot();
				x += length * Math.sin(rad);
				y += length * Math.cos(rad);

				if(isDrawing)
				{
					oldColor = setColor(color);
					drawLine(ox, oy, x, y);
					setColor(oldColor);
				}

				updateDiv();
			},
			rotate: function(deg)
			{
				deg = deg || 0;
				rotation -= deg;
				updateDiv();
			},

			tailUp: function()
			{
				isDrawing = false;
				updateDiv();
			},

			tailDown: function()
			{
				isDrawing = true;
				updateDiv();
			},

			setColor: function(c)
			{
				color = c || color;
				updateDiv();
			}
		}
		updateDiv();
		return tortoise;
	}
}