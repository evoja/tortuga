var drawLine;
var drawCircle;
var setColor;

var initDrawing = function(canvas)
{
	var ctx = canvas.getContext("2d");
	var pointSize = 5;

	drawLine = function (x, y, x1, y1)
	{
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x1, y1);
		ctx.closePath();
		ctx.stroke();
	}

	drawPoint = function(x, y)
	{
		drawCircle(x, y, pointSize);
	}

	drawCircle = function(x, y, r)
	{
		ctx.beginPath();
		ctx.arc(x,y,r,0,2*Math.PI);
		ctx.closePath();
		ctx.stroke();
	}

	setColor = function(color)
	{
		ctx.strokeStyle = color;
	}

	setPointRadius = function(r)
	{
		pointSize = r;
	}
}
