var initTortoiseCanvasBackground;
(function()
{
	initTortoiseCanvasBackground = function(canvas)
	{
		canvas.style["background-image"] = 'url("' + ParamsUtil.getUriParams() + '")';
	}
})()