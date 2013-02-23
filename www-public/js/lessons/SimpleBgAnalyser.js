var initTortoiseCanvasBackground;
(function()
{
	initTortoiseCanvasBackground = function(div)
	{
		div.style["background-image"] = 'url("' + ParamsUtil.getLesson() + '")';
	}
})()