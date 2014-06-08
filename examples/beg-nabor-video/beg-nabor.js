var p = 330
var x = 100
var t =createTortoise(x,p)
var letterColor = "green"
var drawBorderVisible = false
var CyrC = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailUp().go(13).tailDown().rotate(180)
			repeat(90)
			t.go(0.3).rotate(-2)
			end()
			t.tailUp()
			repeat(90)
			t.go(-0.3).rotate(2)
			end()
			t.rotate(180).tailUp().go(16)
}
var CyrUE = function(t)
{
		t.setColor(letterColor).tailUp().go(1).tailDown()
					drawBorder(t)
					t.tailUp().go(13).tailDown()
					repeat(90)
					t.go(0.3).rotate(2)
					end()
					t.tailUp()
					repeat(90)
					t.go(0.15).rotate(2)
					end()
			t.tailDown().tailUp().go(7).tailDown().go(-3).tailUp().go(-10)
			t.tailUp()
			repeat(90)
			t.go(0.15).rotate(2)
			end()
			repeat(90)
			t.go(0.3).rotate(2)
			end()
			t.go(23)
}

var cyrB = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20).rotate(180).go(20).rotate(160)
			t.go(21).rotate(-160).go(19.8).tailUp().rotate(90).go(21)
}
var cyrM = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailUp().go(2).tailDown().setColor(letterColor)
			t.tailUp().go(5).tailDown().rotate(90)
			t.go(20).rotate(-135).go(10).rotate(90).go(10).rotate(-135)
			t.go(20).tailUp().rotate(90).go(8)
}
var cyrTT = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().go(10).rotate(180)
			t.go(10).rotate(-90).go(10).rotate(-90).go(10).rotate(180)
			t.go(10).rotate(-90).go(10).rotate(-90).go(10)
			t.tailUp().rotate(-90).go(20).tailUp().rotate(90).go(20)
}
var cyrG = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20).rotate(-90)
			t.go(10).rotate(-90).go(20).tailUp().rotate(90).go(20)
}
var cyrQ = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20)
			t.rotate(180).go(20).rotate(160)
			t.go(20).rotate(-160).go(20).rotate(180)
			t.go(20).tailUp().go(3)
			t.rotate(90).go(3).tailDown().go(3).tailUp()
			t.rotate(180).go(21).rotate(-90).go(21.7).rotate(90).go(8)
}
var cyrF = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(70).go(20)
			t.rotate(-140).go(20).go(-10).rotate(-112).go(20/3)
			t.rotate(70).go(10.3).rotate(112).tailUp().go(30)
}
var cyrN = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailUp().go(10).tailDown().rotate(90)
			t.go(20).rotate(-90).go(7).rotate(180).go(17).rotate(180)
			t.tailUp().go(29).rotate(-90).go(20).rotate(90)
}
var cyrE = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(45).go(23).rotate(180)
			t.tailUp().go(10).tailDown()
			t.rotate(-90).go(10).rotate(-135).tailUp()
			t.go(27).rotate(-90).go(16.3).rotate(90)
}
var cyrJ = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().go(10).rotate(90).go(20)
			t.rotate(90).go(10).rotate(90).go(20).rotate(90).go(10)
			t.tailUp().go(20)
}
var cyr6 = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20).rotate(-90)
			t.go(10).rotate(180).go(10).rotate(90).go(10)
			t.rotate(90).go(8).rotate(-90).go(10)
			t.rotate(-90).go(8).tailUp().rotate(180).go(30)
}
var cyrU = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20).rotate(-90)
			t.go(10).tailUp().rotate(-90).go(20).rotate(90).go(20)
}
var cyrD = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20)
			t.rotate(-90).go(5).rotate(-90).go(10)
			t.rotate(-90).go(5).rotate(180).go(10)
			t.rotate(-90).go(10).rotate(-90).go(10)
			t.rotate(180).tailUp().go(30)
}
var cyrYY = function(t)
{
			t.setColor(letterColor)
			t.tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20)
			t.rotate(180).go(10).rotate(90)
			t.go(10).rotate(90).go(10).rotate(180)
			t.go(20).tailUp().rotate(90).go(20)
}
var cyrK = function(t)
{
			t.setColor(letterColor).go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(75).go(20)
			t.rotate(-150).go(20).tailUp().rotate(75).go(20)
}
var cyrH = function(t)
{
			t.setColor(letterColor)
			t.tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90)
			t.go(20).rotate(-90)
			repeat(180)
			t.go(0.1).rotate(-1)
			end()
			t.tailUp().rotate(180)
			t.go(28).rotate(-90).go(8.5).rotate(90)
}
var cyrS = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown()
			repeat(180)
			t.go(0.11).rotate(1)
			end()
			t.rotate(90).go(13).rotate(180)
			t.go(20).tailUp().rotate(-90).go(12).rotate(-90)
			t.tailDown().go(19.5)
			t.tailUp().rotate(90).go(18)
}
var cyrM = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown()
			repeat(180)
			t.go(0.11).rotate(1)
			end()
			t.rotate(90).go(13).rotate(180)
			t.go(20).tailUp().rotate(-90)
			t.go(30).rotate(-90).go(19.7).rotate(90)
}
var cyrTD = function(t)
{
			t.setColor(letterColor)
			t.tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailUp().go(5).tailDown()
			repeat(180)
			t.go(0.11).rotate(1)
			end()
			t.rotate(90).go(13)
			t.rotate(180).go(20).rotate(90).go(5).tailUp().rotate(180).go(30)
			t.rotate(-90).go(19.4).rotate(90)
}
var cyrA = function(t)
{
			t.setColor(letterColor).tailUp().go(-7).tailDown()
			drawBorder(t)
			t.tailUp().go(9).tailDown()
			t.rotate(90).go(21).rotate(180).go(12).rotate(90)
			repeat(360)
	    	t.go(0.11).rotate(1)
			end()
			t.tailUp().go(27).rotate(-90).go(9).rotate(90)
}
var cyrUU = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20).rotate(180).go(10).rotate(90).go(3)
			t.rotate(90).go(10).rotate(-90)
			t.go(10).rotate(-90).go(20).rotate(-90).go(10)
			t.rotate(-90).go(10).tailUp()
			t.rotate(-90).go(27).rotate(-90).go(10).rotate(90)
}
var cyrXX = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailUp().tailDown()
			t.rotate(45).go(26).rotate(180).go(13)
			t.rotate(90).go(13).rotate(180)
			t.go(25).rotate(135).tailUp().rotate(90).go(29)
			t.rotate(-90).go(17.5).rotate(90)
}
var cyrL = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(-90).go(5)
			t.rotate(180).go(5).rotate(-90).go(20)
			t.rotate(-90).go(5).rotate(180).go(5).rotate(90).go(5)
			t.rotate(-75).go(20).rotate(150).go(20)
			t.tailUp().rotate(105).go(25).rotate(-90).rotate(90)
}
var cyrI =function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20).rotate(180).go(20).rotate(90).go(5)
			t.rotate(90).go(20).rotate(180).go(20).rotate(90).go(5).rotate(90)
			t.go(20).rotate(180).go(20).tailUp().rotate(90).go(20)
}
var cyrO = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20).rotate(180)
			t.go(20).rotate(90).go(5).rotate(90).go(20)
			t.rotate(180).go(20).rotate(90).go(5)
			t.rotate(90).go(20).rotate(180).go(20)
			t.rotate(90).go(5).rotate(-90).go(5)
			t.tailUp().rotate(90).go(15).rotate(90).go(5).rotate(-90)
}
var cyrW = function(t)
{
			t.setColor(letterColor).tailUp().go(2).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20).rotate(180)
			t.go(20).rotate(90).go(10).rotate(90).go(20).rotate(180).go(20)
			t.rotate(90).go(5).rotate(-90).go(5)
			t.tailUp().rotate(180).go(5).rotate(-90).go(15)
}
var cyrR = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown().rotate(90).go(20).rotate(180)
			t.go(10).rotate(135).go(15).rotate(180)
			t.go(15).rotate(90).go(14).tailUp().rotate(45).go(19)
}
var cyrPP =function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailDown()
			repeat(90)
			t.go(0.20).rotate(2)
			end()
			t.rotate(180)
			repeat(180/2)
			t.go(0.20).rotate(2)
			end()
			t.rotate(180).tailUp().go(30).rotate(-90).go(23).rotate(90)
}
var cyrGG = function(t)
{
			t.setColor(letterColor).tailUp().tailDown()
			drawBorder(t)
			t.tailUp().go(9).tailDown().rotate(90).go(20).rotate(180).go(10)
			t.rotate(45).go(10).rotate(180).go(20).rotate(180).go(10)
			t.rotate(-90).go(10).rotate(180).go(20).tailUp()
			t.rotate(-45).go(13.5).rotate(-90).go(17).rotate(90)
}
var cyrZ = function(t)
{
			t.setColor(letterColor).tailUp().go(1).tailDown()
			drawBorder(t)
			t.tailUp().go(10).tailDown().rotate(90).go(20).rotate(90)
			repeat(90)
			t.go(0.20).rotate(2)
			end()
			t.rotate(-135).go(12).tailUp().rotate(135).go(29)
}
var cyrX = function(t)
{
			t.setColor(letterColor).go(1).tailDown()
			drawBorder(t)
			t.tailUp().go(10).tailDown().rotate(90).go(20).rotate(180)
			t.go(10).rotate(-90).go(10).rotate(-90).go(10).tailUp()
			t.rotate(-90).go(30).rotate(-90).go(20).rotate(90)
}

		//function []
var drawBorder = function(t)
{
	if(drawBorderVisible)
	{
		t.tailDown()
		repeat(4)
		t.go(30).rotate(90)
		end()
		t.tailUp()
	}
}


var tok = function(e)
{
												//This part is responsible for the movement
	// Backspace
	if (8 == e.keyCode) { t.tailDown().capsSquare().setColor("white")
	t.setWidth(65).go(-32).setWidth(1)}
	// Forward
	if (38 == e.keyCode) { t.go(5) }
	// Left
	if (37 == e.keyCode) { t.rotate(10) }
	// Right
	if (39 == e.keyCode) { t.rotate(-10) }
	// Up
	if (49 == e.keyCode) { t.tailUp() }
	// Down
	if (50 == e.keyCode) { t.tailDown() }
	// Back
	if (40 == e.keyCode) { t.go(-5) }
	// Enter
	if (13 == e.keyCode) {
                   t.setX(x)
                   p=p-70
			       t.setY(p)
			       		  }
	if (32 == e.keyCode) { t.go(30) }
			       				//This part is responsible for writing the
			    //b = È
	if (66 == e.keyCode)
	{
		cyrB(t)
	}
				//v = Ì
	if (86 == e.keyCode)
	{
		cyrM(t)
	}
				//t = Å
	if (84 == e.keyCode)
	{
		cyrTT(t)
	}
				//g = Ï
	if (71 == e.keyCode)
	{
		cyrG(t)
	}
				//q = é
	if (81 == e.keyCode)
	{
		cyrQ(t)
	}
				//f = À
	if (70 == e.keyCode)
	{
		cyrF(t)
	}
				//n = Ò
	if (78 == e.keyCode)
	{
		cyrN(t)
	}
				//e = Ó
	if (69 == e.keyCode)
	{
		cyrE(t)
	}
				//j = Î
	if (74 == e.keyCode)
	{
		cyrJ(t)
	}
				// , = Á
	if (188 == e.keyCode)
	{
		cyr6(t)
	}
				//u = Ã
	if (85 == e.keyCode)
	{
		cyrU(t)
	}
				//d = Â
	if (68 == e.keyCode)
	{
		cyrD(t)
	}
				//y = Í
	if (89 == e.keyCode)
	{
		cyrYY(t)
	}
				//k = Ë
	if (75 == e.keyCode)
	{
		cyrK(t)
	}
				//h = Ð
	if (72 == e.keyCode)
	{
		cyrH(t)
	}
				//s = Û
	if(83 == e.keyCode)
	{
		cyrS(t)
	}
				//m = Ü
	if(77 == e.keyCode)
	{
		cyrM(t)
	}
				//] = Ú
	if(221 == e.keyCode)
	{
		cyrTD(t)
	}
				//a = ô
	if(65 == e.keyCode)
	{
		cyrA(t)
	}
				// . = Þ
	if(190 == e.keyCode)
	{
		cyrUU(t)
	}
				//[ = Õ
	if(219 == e.keyCode)
	{
		cyrXX(t)
	}
				//l = Ä
	if(76 == e.keyCode)
	{
		cyrL(t)
	}
				//i = Ø
	if(73 == e.keyCode)
	{
		cyrI(t)
	}
				//o = Ù
	if(79 == e.keyCode)
	{
		cyrO(t)
	}
				//w = Ö
	if(87 == e.keyCode)
	{
		cyrW(t)
	}
				//r = Ê
	if(82 == e.keyCode)
	{
		cyrR(t)
	}
				//p = Ç
	if(80 == e.keyCode)
	{
		cyrPP(t)
	}
				// ; = Æ
	if(186 == e.keyCode)
	{
		cyrGG(t)
	}
				// ' = Ý
	if(222 == e.keyCode)
	{
		CyrUE(t)
	}
				//z = ß
	if(90 == e.keyCode)
	{
		cyrZ(t)
	}
				//x = ×
	if(88 == e.keyCode)
	{
		cyrX(t)
	}
				//ñ = Ñ
	if(67 == e.keyCode)
	{
		CyrC(t)
	}
	e.preventDefault()
}
document.onkeydown = tok
