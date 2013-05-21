ns("Tortuga");
var drawLine;
var drawCircle;
var setColor;
var drawPolyLine;
var setWidth;
var clearCanvas;

Tortuga.initDrawing = function(canvas)
{
	var ctx = canvas.getContext("2d");
	var pointSize = 5;

	var drawPoly = function(points, processPoint)
	{
		ctx.beginPath();
		processPoint(ctx.moveTo, points[0]);
		var size = points.length;
		for(var i = 1; i < size; ++i)
		{
			processPoint(ctx.lineTo, points[i]);
		}
		ctx.stroke();
	}

	drawPolyLine = function(pairs)
	{
		if(pairs.length == 0)
			return;

		var process = pairs[0].x != undefined && pairs[0].y != undefined
			? function(fun, p){fun.call(ctx, p.x, p.y)}
			: function(fun, p){fun.call(ctx, p[0], p[1])}
		drawPoly(pairs, process);
	}

	drawLine = function (x, y, x1, y1)
	{
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x1, y1);
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

	getColorAt = function(x, y)
	{
		var data = ctx.getImageData(x, y, 1, 1).data;
		return data[3]
			? {red: data[0], green: data[1], blue: data[2]}
			: {red: 255, green: 255, blue: 255};
	}

	setColor = function(color)
	{
		ctx.strokeStyle = color;
	}

	setWidth = function(width)
	{
		ctx.lineWidth = width;
	}

	setPointRadius = function(r)
	{
		pointSize = r;
	}
	clearCanvas = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
}