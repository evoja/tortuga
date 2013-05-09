var getHeight = function(width)
{
	return 3 * width / 2;
}

var okno1 = function(t, width)
{
	var height = getHeight(width);

	t.tailDown()
	t.repeat(2).go(height).rotate(90).go(width).rotate(90).end()
	t.tailUp()

	return height
}

var okno3 = function(t, width)
{
	var w = width / 2;
	var h = okno1(t, width);
	t.rotate(90).go(w).rotate(-90)
	t.tailDown().go(h).tailUp()
	t.go(-h * 2 / 3)
	t.rotate(90).tailDown().go(w).tailUp().go(-w).rotate(90)
	t.go(h / 3).rotate(90).go(w).rotate(90)
}

var okno2 = function(t, width)
{
	var w = width/2;
	var h = okno1(t, width)
	t.rotate(-90)
	t.repeat(2)
		.tailDown()
		.go(w).rotate(90).go(h).rotate(90).go(w)
		.tailUp()
		.go(width)
	.end()
	t.rotate(90)

	var l = w / Math.cos(Math.PI / 6);
	t.repeat(2)
		.tailDown()
		.rotate(120).go(l).rotate(-60).go(l)
		.tailUp()
		.rotate(-60).go(h).rotate(180)
	.end()
}

var domik = function(t, l)
{
	t.tailDown()
	t.repeat(4).go(l).rotate(90).end()
	t.rotate(150).go(l).rotate(-120).go(l)
	t.tailUp()
	t.rotate(-120).go(l).rotate(90)
}

var obshaga = function(t, width, rows, cols, okno)
{
	var w1 = width / cols;
	var w = w1 / 2.5;
	var wgap = w1 - w;

	var h = getHeight(w);
	var hgap = h;
	var h1 = 2*h;

	var height = rows * h1 + hgap / 2;

	t.tailDown()
	t.repeat(2).go(height).rotate(90).go(width).rotate(90).end()
	t.tailUp()

	var row = function()
	{
		t.rotate(90).go(wgap / 2).rotate(-90);

		for(var i = 0; i < cols; ++i)
		{
			okno(t, w)
			t.rotate(90).go(w1).rotate(-90)
		}

		t.rotate(-90).go(w1 * cols + wgap / 2).rotate(90);
	}

	t.go(hgap / 2);

	for(var i = 0; i < rows; ++i)
	{
		row();
		t.go(h1)
	}

	t.rotate(180).go(h1 * rows + hgap / 2).rotate(180)
}

var gorod = function(offset, okno, color)
{
	var t = createTortoise(offset, 20, color);
	obshaga(t, 250, 3, 7, okno);
	t.go(1000)

	var t = createTortoise(offset, 180, color);
	obshaga(t, 100, 5, 3, okno);
	t.go(1000)

	var t = createTortoise(offset + 120, 230, color);
	obshaga(t, 130, 10, 10, okno);
	t.go(1000)
}

gorod(100, okno1, "#777")
gorod(500, okno3, "#777")

/*
var t=createTortoise(300, 180, "#777")
domik(t, 200)

t.rotate(-90).go(250).rotate(90)
domik(t, 200)

t.rotate(90).go(500).rotate(-90).go(100)
domik(t, 100)
t.go(500)
*/
/*
var range = function(t, length, count)
{
	for(var i = 0; i < count; ++i)
	{
		domik(t, length)
		t.rotate(90).go(length * 1.5).rotate(-90)
	}
	t.rotate(-90).go(length * 1.5 * count).rotate(90)
}

var t = createTortoise(80, 50, "#777")
range(t, 40, 12)
t.go(40 + 60)
range(t, 60, 8)
t.go(60 + 80)
range(t, 80, 6)
t.go(400)
*/