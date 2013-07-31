/**
Работоспособность урока:

* анализ адресной строки,
* переключение вкладок,
* задний фон.

*/
ns("Tortuga");

Tortuga.initLessons;

(function()
{
var htmlspecialchars = Om.htmlspecialchars
var getAppendedClassName = Om.getAppendedClassName
var appendClass = Om.appendClass
var removeClass = Om.removeClass

var CL_ALL_EMPTY = "tortuga-lessonsContainers-empty"
var CL_UL = "tortuga-lessonsListContainer-list"
var CL_HEADER = "tortuga-lessonsListContainer-header"
var CL_ITEM = "tortuga-lessonsListContainer-item"
var CL_ITEM_SELECTED = "tortuga-lessonsListContainer-itemSelected"
var CL_ITEM_NUMBER = "tortuga-lessonsListContainer-item-number"
var CL_ITEM_TEXT = "tortuga-lessonsListContainer-item-text"
var CL_ITEM_TEXT_SELECTED = "tortuga-lessonsListContainer-item-textSelected"


var getNumberLesson = function()
{
	var position = document.URL.indexOf('#');
	if (position != -1) 
		{
			var number = document.URL.slice(position + 1);
			return number;
		} else return '';
}

var repairLinks = function (text)
{
	var answer = '<a href="$1">$2</a>';
	var f = "&lt;a href=";
	var m1 = "&quot;(.*?)&quot;";
	var m2 = "&#039;(.*?)&#039;";
	var l = "&gt;(.*?)&lt;/a&gt;";
	var r1 = new RegExp(f + m1 + l, "gi");
	var r2 = new RegExp(f + m2 + l, "gi");
	return text.replace(r1, answer).replace(r2, answer)
}

var repairLineBreaks = function (text)
{
	return text.replace(/&lt;br&gt;/gi, "<br/>").replace(/&lt;br\/&gt;/gi, "<br/>")
}

var selectItem = function(item, itemText, itemDiv, itemIndex,
	selectedItemContext, bg, descrDiv, env)
{
	var sic = selectedItemContext;
	env.setLessonsTitle(item.title);
	descrDiv.innerHTML = repairLinks(item.description);
	bg.style["backgroundImage"] = 'url("' + item.src + '")';
	
	if (itemIndex !== undefined){
		window.location.hash = itemIndex;
	}

	if(sic.itemText)
	{
		removeClass(sic.itemText, CL_ITEM_TEXT_SELECTED);
	}
	if(sic.itemDiv)
	{
		removeClass(sic.itemDiv, CL_ITEM_SELECTED);
	}

	sic.itemText = itemText;
	sic.itemDiv = itemDiv;
	appendClass(itemText, CL_ITEM_TEXT_SELECTED);
	appendClass(itemDiv, CL_ITEM_SELECTED);
	appendClass(item)
}

var applyItem = function(list, inputItem, bg, selectedItemContext, 
	descrDiv, itemIndex, env)
{
	var item = {
		src : htmlspecialchars(inputItem.src),
		title : htmlspecialchars(inputItem.title, true),
		description : repairLineBreaks(repairLinks(
			htmlspecialchars(inputItem.description, true)))
	}
	var sic = selectedItemContext;
	var itemNumber = document.createElement("DIV");
	appendClass(itemNumber, CL_ITEM_NUMBER);
	itemNumber.innerHTML = itemIndex;
	var itemText = document.createElement("DIV");
	appendClass(itemText, CL_ITEM_TEXT);
	itemText.innerHTML = item.title;

	var itemDiv = document.createElement("LI");
	appendClass(itemDiv, CL_ITEM);

	var selectCurrentItem = function()
	{
		selectItem(item, itemText, itemDiv, itemIndex, sic, bg, descrDiv, env);
	}

	itemDiv.onclick = selectCurrentItem;

	itemDiv.appendChild(itemNumber);
	itemDiv.appendChild(itemText);
	list.appendChild(itemDiv);

	return {
		// item: item,
		// itemText: itemText,
		// itemDiv: itemDiv,
		selectCurrent: selectCurrentItem
	}
}

var createList = function(lesson, bg, descrDiv, env)
{
	var ul = document.createElement("UL");
	appendClass(ul, CL_UL);
	var size = lesson.length;
	var selectedItemContext = {};
	var aifun = function(item, index)
	{
		return applyItem(ul, item, bg, selectedItemContext, descrDiv, index, env)
	}

	var selectedObject = aifun(lesson[0], 1);
	var selectedIndex = getNumberLesson - 1;

	for(var i = 1; i < size; ++i)
	{
		var item = aifun(lesson[i], i+1)
		if(selectedIndex == i)
		{
			selectedObject = item;
		}
	}
	
	selectedObject.selectCurrent()
	return ul;
}

var LessonEnv = function(tortugaEnv, title)
{
	this.tortugaEnv = tortugaEnv;
	this.title = title;
}
LessonEnv.prototype.setLessonsTitle = function(itemTitle)
{
	this.tortugaEnv.setLessonsTitle(itemTitle + " \\ " + this.title);
}

Tortuga.initLessons = function(bg, list, descrDiv, env, allContainers)
{
	var lesson = Tortuga.ParamsUtil.getLesson();
	if(lesson == null)
	{
		if(allContainers != null)
		{
			allContainers.forEach(function(item)
			{
				appendClass(item, CL_ALL_EMPTY);
			})
		}
		return
	}
	else
	{
		if(allContainers != null)
		{
			allContainers.forEach(function(item)
			{
				removeClass(item, CL_ALL_EMPTY);
			})
		}
	}



	var header = document.createElement("DIV");
	appendClass(header, CL_HEADER);
	list.appendChild(header);

	list.appendChild(createList(lesson.items, bg, descrDiv,
		new LessonEnv(env, lesson.title)));
}

})()