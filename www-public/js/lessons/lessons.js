ns("Tortuga");
(function()
{
var getAppendedClassName = Om.getAppendedClassName
var CL_UL = "tortuga-lessonsListContainer-list"
var CL_HEADER = "tortuga-lessonsListContainer-header"
var CL_ITEM = "tortuga-lessonsListContainer-item"
var CL_ITEM_SELECTED = "tortuga-lessonsListContainer-itemSelected"
var CL_ITEM_TEXT = "tortuga-lessonsListContainer-item-text"
var CL_ITEM_TEXT_SELECTED = "tortuga-lessonsListContainer-item-textSelected"

var appendClass = function (elem, className)
{
	elem.className = getAppendedClassName(elem.className, className)
}

var removeClass = function (elem, className)
{
	var old = elem.className;
	var index = old.indexOf(className);
	if(index < 0)
		return;

	var isLast = index + className.length == old.length;
	var isFirst = index == 0;
	var cut = old.substring(0, index) + old.substring(index + className.length);

	if(!isLast)
	{
		cut = cut.substring(index, index + 1);
	}
	if(isLast && !isFirst)
	{
		cut = cut.substring(0, index - 1);
	}

	elem.className = cut;
}

var selectItem = function(item, itemText, itemDiv,
	selectedItemContext, bg)
{
	var sic = selectedItemContext;
	document.title = item.title;
	bg.style["background-image"] = 'url("' + item.src + '")';

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

var applyItem = function(list, item, bg, selectedItemContext)
{
	var sic = selectedItemContext;
	var itemText = document.createElement("DIV");
	appendClass(itemText, CL_ITEM_TEXT);
	itemText.innerHTML = item.title;

	var itemDiv = document.createElement("LI");
	appendClass(itemDiv, CL_ITEM);
	itemDiv.onclick = function(e)
	{
		selectItem(item, itemText, itemDiv, sic, bg);
	}
	itemDiv.appendChild(itemText);
	list.appendChild(itemDiv);

	return {
		item: item,
		itemText: itemText,
		itemDiv: itemDiv
	}
}

var createList = function(lesson, bg)
{
	var ul = document.createElement("UL");
	appendClass(ul, CL_UL);
	var size = lesson.length;
	var selectedItemContext = {};
	var firstObject = applyItem(ul, lesson[0], bg, selectedItemContext);
	for(var i = 1; i < size; ++i)
	{
		applyItem(ul, lesson[i], bg, selectedItemContext);
	}
	selectItem(firstObject.item, firstObject.itemText, firstObject.itemDiv,
		selectedItemContext, bg);
	return ul;
}

Tortuga.initLessons = function(bg, list)
{
	var lesson = Tortuga.ParamsUtil.getLesson();
	if(lesson == null)
		return

	var header = document.createElement("H2");
	appendClass(header, CL_HEADER);
	list.appendChild(header);

	list.appendChild(createList(lesson, bg));
}

})()