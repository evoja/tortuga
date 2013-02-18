var createTortoise;
var initTortoise = function(canvas, tortoiseContainer)
{
	var width = 32;
	var height = 32;
	var createTortoiseDiv = function()
	{
		var ttd = document.createElement("DIV");
		ttd.className = "ttx";
		ttd.style.width = width + "px";
		ttd.style.height = height + "px";
		tortoiseContainer.appendChild(ttd);

		var tti = document.createElement("DIV");
		tti.className = "tti";
		tti.style.width = "4px";
		tti.style.height = "4px";
		tti.style.position = "relative";
		tti.style.top = "28px";
		tti.style.left = "14px";
		ttd.appendChild(tti);

		return {ttd:ttd, tti:tti};
	}

	createTortoise = function(xx, yy)
	{
		var ttdi = createTortoiseDiv();
		var ttd = ttdi.ttd;
		var x = xx || 0;
		var y = yy || 0;
		var color = "#000";
		var rotation = 180;
		var isDrawing = false;

		var radRot = function()
		{
			return Math.PI - degToRad(rotation);
		}

		var updateDiv = function()
		{
			var rad = radRot();
			var dx = width * (Math.cos(rad)/2 + Math.sin(rad));
			var dy = height * (Math.cos(rad) - Math.sin(rad) / 2);
			ttd.style.left = (x + dx) + "px";
			ttd.style.top =  (y + dy) + "px";
			ttd.style["-webkit-transform"] = "rotate(" + rotation + "deg)";
			ttd.style["-webkit-transform-origin"] = "0% 0%"

			ttdi.tti.style.background = isDrawing ? color : "none";
		}

		var degToRad = function(deg)
		{
			return deg / 180 * Math.PI;
		}

		var tortoise = {
			go: function(length)
			{
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
				color = c;
				updateDiv();
			}
		}
		updateDiv();
		return tortoise;
	}
}