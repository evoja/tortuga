var initLessons
(function()
{
var applyItem = function(list, item, bg)
{
	var itemText = document.createElement("DIV");
	itemText.className = "lessonsList-item-text";
	itemText.innerHTML = item.title;

	var itemDiv = document.createElement("LI");
	itemDiv.className = "lessonsList-item";
	itemDiv.onclick = function(e)
	{
		console.log(item);
	}
	itemDiv.appendChild(itemText);

	list.appendChild(itemDiv);
}

var createList = function(lesson, bg)
{
	var ul = document.createElement("UL");
	var size = lesson.length;
	for(var i = 0; i < size; ++i)
	{
		applyItem(ul, lesson[i], bg);
	}
	return ul;
}

initLessons = function(bg, list)
{
	var lesson = ParamsUtil.getLesson();
	if(lesson == null)
		return

	var header = document.createElement("H2");
	header.innerHTML = "Уроки";
	list.appendChild(header);

	list.appendChild(createList(lesson, bg));
}

})()