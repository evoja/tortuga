//======= Page 1 ===========================//
// Видим функцию badCyrC(), которая рисует очень сложную букву,
// которую мы никак-никак-никак не можем выровнять, потому что
// она имеет очень сложную форму.
// Черепашка в конце пути оказывается не в той точке, где стартовала
// и повёрнута не на тот угол.

var drawBorder = function(t)
{
	repeat(4)
	t.go(80).rotate(90)
	end()
}

var badCyrC = function(t)
{
	t.tailDown()
	drawBorder(t)
	t.go(40)
	t.rotate(180)
	repeat(10)
		t.go(8)
		t.rotate(-17)
	end()
	t.tailUp()
	t.rotate(-90)
	t.go(40)
	t.rotate(90)
	t.go(-40)
}

var t = createTortoise()
badCyrC(t)

var draw = function(){
	badCyrC(t);
	t.go(80)
}





//======= Page 2 ===========================//
// Делаем небольшую хитрость.
// Добавляем черепахе параметр знака для длины и для поворота.
// Ничего не изменилось,
// просто каждое число умножили на коэффициент, даже не размышляя.


var drawBorder = function(t)
{
	repeat(4)
	t.go(80).rotate(90)
	end()
}

var badCyrC = function(t, koeff_length, koeff_angel)
{
	t.tailDown()
	drawBorder(t)
	t.go(40 * koeff_length)
	t.rotate(180 * koeff_angel)
	repeat(10)
		t.go(8 * koeff_length)
		t.rotate(-17 * koeff_angel)
	end()
	t.tailUp()
	t.rotate(-90 * koeff_angel)
	t.go(40 * koeff_length)
	t.rotate(90 * koeff_angel)
	t.go(-40 * koeff_length)
}

var t = createTortoise()

//Попробуйте позапускать с разными значениями параметров.
badCyrC(t, 1, 1)
//badCyrC(t, -1, 1)
//badCyrC(t, -1, -1)










//======= Page 3 ===========================//
// Добавляю флаг видимости.
// Если он выключен, то черепаха проходит весь путь, но ничего не рисует.


var drawBorder = function(t)
{
	repeat(4)
	t.go(80).rotate(90)
	end()
}

var badCyrC = function(t, koeff_length, koeff_angel, visible)
{
	if(visible)
	{
		t.tailDown()
	}
	else
	{
		t.tailUp()
	}

	drawBorder(t)
	t.go(40 * koeff_length)
	t.rotate(180 * koeff_angel)
	repeat(10)
		t.go(8 * koeff_length)
		t.rotate(-17 * koeff_angel)
	end()
	t.tailUp()
	t.rotate(-90 * koeff_angel)
	t.go(40 * koeff_length)
	t.rotate(90 * koeff_angel)
	t.go(-40 * koeff_length)
}

var t = createTortoise()

//Попробуйте позапускать с разными значениями параметров.
badCyrC(t, 1, 1, true)
badCyrC(t, -1, 1, false)
//badCyrC(t, -1, -1, false)







//======= Page 4 ===========================//
// А что произойдёт, если сделать друг за другом такие вызовы:
badCyrC(t, 1, 1, true)
badCyrC(t, 1, -1, false)
badCyrC(t, -1, 1, false)
badCyrC(t, -1, -1, false)











//======= Page 5 ===========================//
// Используем это в правильной функции рисования буквы.


var drawBorder = function(t)
{
	repeat(4)
	t.go(80).rotate(90)
	end()
}

var badCyrC = function(t, koeff_length, koeff_angel, visible)
{
	if(visible)
	{
		t.tailDown()
	}
	else
	{
		t.tailUp()
	}

	drawBorder(t)
	t.go(40 * koeff_length)
	t.rotate(180 * koeff_angel)
	repeat(10)
		t.go(8 * koeff_length)
		t.rotate(-17 * koeff_angel)
	end()
	t.tailUp()
	t.rotate(-90 * koeff_angel)
	t.go(40 * koeff_length)
	t.rotate(90 * koeff_angel)
	t.go(-40 * koeff_length)
}

var cyrC = function(t)
{
	badCyrC(t, 1, 1, true)
	badCyrC(t, 1, -1, false)
	badCyrC(t, -1, 1, false)
	badCyrC(t, -1, -1, false)
}

var t = createTortoise()
cyrC(t)










//======= Page 6 ===========================//
// А что если у нас много букв. Например, С и Э.
// Заметим, что cyrC и cyrUE получились очень похожими.


var drawBorder = function(t)
{
	repeat(4)
	t.go(80).rotate(90)
	end()
}

var badCyrC = function(t, koeff_length, koeff_angel, visible)
{
	if(visible)
	{
		t.tailDown()
	}
	else
	{
		t.tailUp()
	}

	drawBorder(t)
	t.go(40 * koeff_length)
	t.rotate(180 * koeff_angel)
	repeat(10)
		t.go(8 * koeff_length)
		t.rotate(-17 * koeff_angel)
	end()
	t.tailUp()
	t.rotate(-90 * koeff_angel)
	t.go(40 * koeff_length)
	t.rotate(90 * koeff_angel)
	t.go(-40 * koeff_length)
}

var badCyrUE = function(t, koeff_length, koeff_angel, visible)
{
	if(visible)
	{
		t.tailDown()
	}
	else
	{
		t.tailUp()
	}

	drawBorder(t)
	repeat(5)
		t.go(8 * koeff_length)
		t.rotate(17 * koeff_angel)
	end()
	t.rotate(90 * koeff_angel)
	t.go(20 * koeff_length)
	t.go(-20 * koeff_length)
	t.rotate(-90 * koeff_angel)
	repeat(5)
		t.go(8 * koeff_length)
		t.rotate(17 * koeff_angel)
	end()

	t.tailUp()
	t.rotate(90 * koeff_angel)
	t.go(50 * koeff_length)
	t.rotate(90 * koeff_angel)
}


var cyrC = function(t)
{
	badCyrC(t, 1, 1, true)
	badCyrC(t, 1, -1, false)
	badCyrC(t, -1, 1, false)
	badCyrC(t, -1, -1, false)
}
var cyrUE = function(t)
{
	badCyrUE(t, 1, 1, true)
	badCyrUE(t, 1, -1, false)
	badCyrUE(t, -1, 1, false)
	badCyrUE(t, -1, -1, false)
}


var t = createTortoise()
cyrC(t)
t.go(100)
cyrUE(t)
t.go(100)











//======= Page 7 ===========================//
// Вместо двух функций cyrC() и cyrUE()
// Сделаем одну - goodLetter()


var drawBorder = function(t)
{
	repeat(4)
	t.go(80).rotate(90)
	end()
}

var badCyrC = function(t, koeff_length, koeff_angel, visible)
{
	if(visible)
	{
		t.tailDown()
	}
	else
	{
		t.tailUp()
	}

	drawBorder(t)
	t.go(40 * koeff_length)
	t.rotate(180 * koeff_angel)
	repeat(10)
		t.go(8 * koeff_length)
		t.rotate(-17 * koeff_angel)
	end()
	t.tailUp()
	t.rotate(-90 * koeff_angel)
	t.go(40 * koeff_length)
	t.rotate(90 * koeff_angel)
	t.go(-40 * koeff_length)
}

var badCyrUE = function(t, koeff_length, koeff_angel, visible)
{
	if(visible)
	{
		t.tailDown()
	}
	else
	{
		t.tailUp()
	}

	drawBorder(t)
	repeat(5)
		t.go(8 * koeff_length)
		t.rotate(17 * koeff_angel)
	end()
	t.rotate(90 * koeff_angel)
	t.go(20 * koeff_length)
	t.go(-20 * koeff_length)
	t.rotate(-90 * koeff_angel)
	repeat(5)
		t.go(8 * koeff_length)
		t.rotate(17 * koeff_angel)
	end()

	t.tailUp()
	t.rotate(90 * koeff_angel)
	t.go(50 * koeff_length)
	t.rotate(90 * koeff_angel)
}


var goodLetter = function(t, badLetter)
{
	badLetter(t, 1, 1, true)
	badLetter(t, 1, -1, false)
	badLetter(t, -1, 1, false)
	badLetter(t, -1, -1, false)
}


var t = createTortoise()
goodLetter(t, badCyrC)
t.go(100)
goodLetter(t, badCyrUE)
t.go(100)
























//======= Page 8 ===========================//
// Итогом прошлого урока получились две функции с кучей параметров:
// badCyrC() и badCyrUE() - это переделанные исходные
// функции с одним параметром - черепашкой.
//
// Но мы прекрасно понимаем, что начальных функций было не 2, а 32
// и переделывать их всех, домножая все-все числа на коэффициенты,
// во-первых, задолбаешься, а во-вторых, наделаешь кучу ошибок.
//
// Как быть?
//
// Итак у нас есть начальная ситуация, функции без коэффициентов,
// мы хотим переделывать поменьше, но чтобы коэффициенты в итоге учитывались:

var drawBorder = function(t)
{
	repeat(4)
	t.go(80).rotate(90)
	end()
}

var badCyrC = function(t)
{
	t.tailDown()
	drawBorder(t)
	t.go(40)
	t.rotate(180)
	repeat(10)
		t.go(8)
		t.rotate(-17)
	end()
	t.tailUp()
	t.rotate(-90)
	t.go(40)
	t.rotate(90)
	t.go(-40)
}

var badCyrUE = function(t)
{
	t.tailDown()
	drawBorder(t)
	repeat(5)
		t.go(8)
		t.rotate(17)
	end()
	t.rotate(90)
	t.go(20)
	t.go(-20)
	t.rotate(-90)
	repeat(5)
		t.go(8)
		t.rotate(17)
	end()

	t.tailUp()
	t.rotate(90)
	t.go(50)
	t.rotate(90)
}



// Создаём такие вспомогательные функции.
//
// Я не готов объяснять, что это значит.
// Ничего сложного, конечно, в этом нет, но объяснять с нуля
// пришлось бы очень обстоятельно.
// Если интересно, то поищите в интернете по запросам "JavaScript объекты"
// и "JavaScript this"

var my_go = function(length)
{
	this.t.go(length * this.koeff_length)
	return this
}

var my_rotate = function(angel)
{
	this.t.rotate(angel * this.koeff_angel)
	return this
}

var my_tailDown = function()
{
	if(this.visible)
	{
		this.t.tailDown()
	}
	else
	{
		this.t.tailUp()
	}
	return this
}

var my_tailUp = function()
{
	this.t.tailUp()
	return this
}

var my_setColor = function(color)
{
	this.t.setColor(color)
	return this
}

var draw_with_params = function(my_t, badLetter, koeff_length, koeff_angel, visible)
{
	my_t.koeff_length = koeff_length
	my_t.koeff_angel = koeff_angel
	my_t.visible = visible
	badLetter(my_t)
}


// Теперь создаём функцию goodLetter()

var goodLetter = function(t, badLetter)
{
	var my_t = {
		t: t,
		go: my_go,
		rotate: my_rotate,
		tailDown: my_tailDown,
		tailUp: my_tailUp,
		setColor: my_setColor
	}

	draw_with_params(my_t, badLetter, 1, 1, true)
	draw_with_params(my_t, badLetter, 1, -1, false)
	draw_with_params(my_t, badLetter, -1, 1, false)
	draw_with_params(my_t, badLetter, -1, -1, false)
}


// Voilà!

var t = createTortoise()
goodLetter(t, badCyrC)
t.go(100)
goodLetter(t, badCyrUE)
t.go(100)


// Никакую из начальных функций переделывать не пришлось!

