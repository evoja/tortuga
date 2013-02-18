var createTortoise;
var initTortoise = function(canvas, tortoiseContainer)
{
	var width = 32;
	var height = 32;
	createTortoise = function(xx, yy)
	{
		var ttd = document.createElement("DIV");
		ttd.className = "ttx";
		ttd.style.width = width + "px";
		ttd.style.height = height + "px";
		tortoiseContainer.appendChild(ttd);

		var x = xx;
		var y = yy;
		var color = "#000";
		var rotation = 180;

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
				updateDiv();

				oldColor = setColor(color);
				drawLine(ox, oy, x, y);
				setColor(oldColor);
			},
			rotate: function(deg)
			{
				rotation -= deg;
				updateDiv();
			}
		}
		updateDiv();
		return tortoise;
	}
}