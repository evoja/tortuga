var cell = 20

var simple_rect_fill = function(t, width, height)
{
	t.go(width/2).rotate(90);
	t.tailDown().capsSquare().setWidth(width);
	t.go(height);
	t.tailUp();
	t.go(-height).rotate(-90).go(-width/2);
};

var rect_fill = function(t, x, y, width, height)
{
	t.go(x).rotate(90).go(y).rotate(-90);
	simple_rect_fill(t, width, height);
	t.go(-x).rotate(90).go(-y).rotate(-90);
};

var wall = function(t, cx, cy, c_width, c_height)
{
	rect_fill(t, cx * cell, cy * cell, c_width * cell, c_height * cell)
};

var labirint_by_data = function(t, data)
{
	for(var i = 0; i < data.length; ++i)
	{
		var w = data[i]
		wall(t, w[0], w[1], w[2], w[3])
	}
}

var labirint = function(t)
{
	// Тут вы рисуете свой лабиринт.
	var data = [
		[0, 0, 1, 6],
		[1, 0, 4, 1],
		[4, 1, 1, 3],
		[1, 5, 6, 1],
		[2, 3, 2, 1],
		[2, 2, 1, 1],
		[6, 0, 1, 5]
	];

	labirint_by_data(t, data);
};

var draw_hero = function(t, cx, cy)
{
	wall(t, cx, cy, 1, 1);
};

var hero_cx = 1;
var hero_cy = 1;
var global_t = createTortoise();

var draw_world = function()
{
	clearCanvas();
	global_t.setColor("green");
	labirint(global_t);
	global_t.setColor("red");
	draw_hero(global_t, hero_cx, hero_cy);
};


var is_cell_free = function(t, cx, cy)
{
	var dx = (cx + .5) * cell;
	var dy = (cy + .5) * cell;
	t.go(dx).rotate(90).go(dy);
	var color = t.getColorUnderTail();
	t.go(-dy).rotate(-90).go(-dx);
	return color.red == 255 && color.blue == 255 && color.green == 255;
};

document.onkeydown = function(e)
{
	var hero_diff = {
		'38' : [ 0,  1], // up
		'37' : [-1,  0], // left
		'39' : [ 1,  0], // right
		'40' : [ 0, -1]  // down
	};

	var diff = hero_diff[e.keyCode];

	if(diff == undefined)
	{
		return;
	}
	e.preventDefault();

	var cx = hero_cx + diff[0]
	var cy = hero_cy + diff[1]

	if(is_cell_free(global_t, cx, cy))
	{
		hero_cx = cx;
		hero_cy = cy;
	}

	draw_world();
};

draw_world();