ns("Tortuga.Vm");

(function()
{
	//==== Context functions ==================================================
	var extractCtxFromCanvasAndConfigure = function(canvas)
	{
		var ctx = canvas.getContext("2d")
		ctx.lineJoin = "round"
		ctx.lineCap = "round"
		return ctx;		
	}

	var setColor = function(ctx, color)
	{
		ctx.strokeStyle = color;
	}

	var setWidth = function(ctx, width)
	{
		ctx.lineWidth = width;
	}

	var getColorAt = function(ctx, x, y, withAlpha)
	{
			var data = this.ctx.getImageData(x, y, 1, 1).data
			var color = data[3]
				? {red: data[0], green: data[1], blue: data[2]}
				: {red: 255, green: 255, blue: 255}

			if(withAlpha)
			{
				color.alpha = data[3]
			}

			return color
	}

	//==== DrawingSystem =======================================================
	var DrawingSystem = function(canvas)
	{
		this.ctx = extractCtxFromCanvasAndConfigure(canvas)
	}

	DrawingSystem.prototype = {
		setTransform: function(a, b, c, d, e, f){ this.ctx.setTransform(a, b, c, d, e, f) },
		setColor:     function(color){            setColor(this.ctx, color) },
		getColorAt:   function(x, y){             return getColorAt(this.ctx, x, y, false) },
		getColorWithAlphaAt: function(x, y){      return getColorAt(this.ctx, x, y, true) },
		setWidth:     function(){                 setWidth(this.ctx, width) },
		moveTo:       function(x, y){             this.ctx.moveTo(x, y) },
		lineTo:       function(){                 this.ctx.lineTo(x, y) },
		beginPath:    function(){                 this.ctx.beginPath() },
		stroke:       function(){                 this.ctx.stroke() },
		clearCanvas:  function(){ctx.clearRect(0, 0, canvas.width, canvas.height)},

		createTortoise: function(){},
		placeTortoise: function(dsTortoiseId, x, y, rotation){},
		destroyTortoise: function(dsTortoiseId){},
		resetSystem: function(){},

		hide: function(){},
		show: function(){},
	}


	Tortuga.Vm.initDrawingSystem = function(canvas)
	{

	}
})()