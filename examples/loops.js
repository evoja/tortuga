t = createTortoise(500, 100, "#0a0");
repeat(10)
	t.dw().fw(10).up().fw(5)
end()

d = createTortoise(100, 100, "#00a");
repeat(5)
	repeat(5)
		t.dw()
		repeat(4)
			t.fw(20).
			lt(90)
		end()
		t.up().
		fw(30)
	end()
	t.lt(180)
	repeat(5)
		t.fw(30)
	end()
	t.rt(90).
	fw(30).
	rt(90)
end();