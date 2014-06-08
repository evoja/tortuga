var square = function(t, size)
{
	t.tailDown();
	repeat(4);
	t.go(size).rotate(90);
	end();
	t.tailUp();
};

var t = createTortoise(50, 50);
square(t, 50);
t.go(100);
square(t, 50);
t.go(100);
square(t, 50);
















//========================================================



var okno = function(t, w, h)
{
	t.tailDown();
	repeat(2);
	t.go(w).rotate(90);
	t.go(h).rotate(90);
	end();
	t.tailUp();
};

var t = createTortoise(50, 50);
okno(t, 20, 30);
t.go(50);
okno(t, 20, 30);
t.go(50);
okno(t, 20, 30);
t.go(50);
okno(t, 20, 30);
t.go(50);










//========================================================


var square = function(t, size)
{
	t.tailDown();
	repeat(4);
	t.go(size).rotate(90);
	end();
	t.tailUp();
};

var dom = function(t, size)
{
	square(t, size);
	t.rotate(90).go(size).rotate(-30);
	t.tailDown();
	t.go(size).rotate(-120).go(size).rotate(-30);
	t.tailUp();
	t.go(size).rotate(-90).go(size).rotate(180);
};

var t = createTortoise(50, 50);
dom(t, 50);
t.go(100);
dom(t, 50);
t.go(100);
dom(t, 50);
t.go(100);
dom(t, 50);


t.rotate(90).go(120).rotate(-90);
dom(t, 50);
t.rotate(90).go(120).rotate(-90);
dom(t, 50);
t.rotate(90).go(120).rotate(-90);
dom(t, 50);
t.rotate(90).go(120).rotate(-90);




	square(t, size);
	t.rotate(90).go(size).rotate(-30);
	t.tailDown();
	t.go(size).rotate(-120).go(size).rotate(-30);
	t.tailUp();
	t.go(size).rotate(-90).go(size).rotate(180);

	t.tailDown();
	repeat(2);
	t.go(w).rotate(90);
	t.go(h).rotate(90);
	end();
	t.tailUp();

	t.rotate(90).go(120).rotate(-90);

	square(t, size);
	t.rotate(90).go(size).rotate(-30);
	t.tailDown();
	t.go(size).rotate(-120).go(size).rotate(-30);
	t.tailUp();
	t.go(size).rotate(-90).go(size).rotate(180);

	t.tailDown();
	repeat(2);
	t.go(w).rotate(90);
	t.go(h).rotate(90);
	end();
	t.tailUp();
}
t.rotate(90).go(120).rotate(-90);

	square(t, size);
	t.rotate(90).go(size).rotate(-30);
	t.tailDown();
	t.go(size).rotate(-120).go(size).rotate(-30);
	t.tailUp();
	t.go(size).rotate(-90).go(size).rotate(180);


