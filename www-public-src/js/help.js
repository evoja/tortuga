/**
В этом файле определяется функция Tortuga.initHelp()

Инициируется работа пузыря с помощью.
Там при нажатии на вопросик должны какие-то элементы появляться,
какие-то - пропадать, и наоборот тоже должно всё происходить.
За это файлик и отвечает.

При вызове функции Tortuga.initHelp() создаются нужные данные,
связываются существующие html-элементы,
сооздаются вспомогательные,
на элементы навешиваются разные обработчики событий, 
ну и вообще, всё опутывается некоторой логикой отображения помощи.
*/
om.ns("Tortuga");

Tortuga.initHelp;

(function()
{
	var CL_HELP_SHOWN = "sideHelp-shown"
	var CL_POINTER = "pointer"

	var falseFun = function(){return false}

	var appendClass = function(elem, className)
	{
		elem.classList.add(className)
	}

	var removeClass = function(elem, className)
	{
		elem.classList.remove(className)
	}

	var createForEachHandler = function(fun, o)
	{
		return function(item)
		{
			item.onclick = function(){fun(o)}
			item.onmousedown = falseFun
			appendClass(item, CL_POINTER)
		}
	}


	var funs = {};

	funs.showHelp = function(o)
	{
		o.helpDivs.forEach(function(item)
		{
			appendClass(item, CL_HELP_SHOWN);
		})

		o.helpButtons.forEach(createForEachHandler(funs.hideHelp, o))
	}

	funs.hideHelp = function(o)
	{
		o.helpDivs.forEach(function(item)
		{
			removeClass(item, CL_HELP_SHOWN);
		})

		o.helpButtons.forEach(createForEachHandler(funs.showHelp, o))
	}

	Tortuga.initHelp = function(helpButtons, helpDivs){
		funs.hideHelp({
			helpButtons:helpButtons,
			helpDivs:helpDivs
		})
	}
})();