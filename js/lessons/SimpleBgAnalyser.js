/**
Этот файл, кажется, нигде не используется.
*/
ns("Tortuga");
Tortuga.initTortoiseCanvasBackground = function(div)
{
	var lesson = ParamsUtil.getLesson()[0];
	document.title = lesson.title;
	div.style["background-image"] = 'url("' + lesson.src + '")';
}
