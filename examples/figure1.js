var t = createTortoise(400, 200)
t.tailDown();
for(var i = 0; i < 36; ++i)
{
	t.rotate(-10)
	for(var j = 0; j < 360; ++j)
	{
		t.go(3)
		t.rotate(-1)
	}
}
