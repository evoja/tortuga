(function()
{
var halfSize = 50
var size = halfSize * 2
var t = createTortoise()
t.setWidth(40)
t.go(size)

var colors = ["red", "green", "blue", "black", "purple", "brown"]
var colorIndex = 0;
var nextColor = function()
{
	t.setColor(colors[colorIndex])
	colorIndex = (colorIndex + 1) % colors.length
}



var one = function()
{
	t.tailDown()
	t.go(1)
	t.tailUp()
	t.go(-1)
}

var two = function()
{
	t.go(halfSize)
	t.rotate(90)
	t.go(halfSize)
	one()
	t.rotate(90)
	t.go(size)
	t.rotate(90)
	t.go(size)
	one()
	t.rotate(90)
	t.go(halfSize)
	t.rotate(90)
	t.go(halfSize)
	t.rotate(270);
}

var three = function()
{
	one()
	two()
}

var four = function()
{
	two()
	t.rotate(90)
	two()
	t.rotate(-90)
}


var digits = [one, two, three, four]

var rand = function()
{
	return Math.floor(Math.random() * 4)
}

var doStep = function()
{
	t.go(-size)
	clearCanvas()
	nextColor()
	digits[rand()]()
	t.go(size)
}

document.onclick = doStep

window.doStep = doStep
})()