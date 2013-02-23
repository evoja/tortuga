var initLessonConstructor;

(function(){
var getLinkAreaText = function(areaValue)
{
	var link = ParamsUtil.getLessonLink(areaValue);
	return link;
}

var updateLinkArea = function(linkarea, areaValue)
{
	var url = getLinkAreaText(areaValue);

	linkarea.innerHTML = "";
	if(url.length < 2000)
	{
		var textinput = document.createElement("INPUT");
		textinput.type = "text";
		textinput.disabled = true;
		textinput.value = url;

		var link = document.createElement("A");
		link.href = url;
		link.innerHTML = "Try lesson";

		linkarea.appendChild(textinput);
		linkarea.appendChild(link);
		textinput.select();
	}
	else
	{
		linkarea.innerHTML = "Слишком длинный урок (" + areaValue.length + ")";
	}
}

initLessonConstructor = function(area, button, linkarea)
{
	button.onclick = function(e){updateLinkArea(linkarea, area.value)}

}
})()