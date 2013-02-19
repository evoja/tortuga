t = createTortoise(500, 100, "#0a0");
t.repeat(10).
	dw().fw(10).up().fw(5).
end();

d = createTortoise(100, 100, "#00a");
d.repeat(5).
	repeat(5).
		dw().
		repeat(4).
			fw(20).
			lt(90).
		end().
		up().
		fw(30).
	end().
	lt(180).
	repeat(5).
		fw(30).
	end().
	rt(90).
	fw(30).
	rt(90).
end();